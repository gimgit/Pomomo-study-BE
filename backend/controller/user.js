const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let now = new Date(Date.now() + 32400000);
let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
let year = now.getFullYear();
let month = now.getMonth() + 1;
let date = now.getDate();
let nextDate = tomorrow.getDate();

let yesterday = now.getDate() - 1;
// mvp : 오늘 공부시간 00시 기준으로 초기화

let todayStart;
let todayEnd;

let a = new Date().getHours();
a < 4
  ? (todayStart = `${year}-${month}-${yesterday}T04:00:00.000Z`)
  : console.log("4시 이전");
a < 4
  ? (todayEnd = `${year}-${month}-${date}T04:00:00.000Z`)
  : console.log("4시 이전");

console.log(now);
console.log(a);
console.log(todayStart);
console.log(todayEnd);

async function checkUserInfo(req, res) {
  const { userId } = req.params;

  try {
    const userInfo = await User.findAll({
      where: { userId: userId },
      attributes: { exclude: ["password"] },
    });
    const studyRecord = await StudyTime.findAll({
      where: { userId: userId },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "total"]],
    });
    const todayRecord = await StudyTime.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "today"]],
    });
    console.log(now);
    console.log(tomorrow);
    console.log(todayStart);
    console.log(todayEnd);
    return res.status(200).json({
      user: userInfo,
      totalRecord: studyRecord,
      todayRecord: todayRecord,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserInfo(req, res) {
  const { userId } = req.params;
  const { category, nick } = req.body;
  try {
    const userInfo = await User.findOne({
      where: { userId: userId },
    });
    if (!userInfo) return res.status(400).send("err");

    await User.update(
      { category: category, nick: nick },
      { where: { userId: userId } }
    );
    return res.status(201).send({ msg: "수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "이미 존재하는 닉네임 또는 요청하는 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserStatus(req, res) {
  const { userId } = req.params;
  const { statusMsg } = req.body;
  try {
    const userInfo = await User.findOne({ where: { userId: userId } });
    if (!userInfo)
      return res
        .status(400)
        .send({ msg: "요청한 데이터 형식이 올바르지 않습니다." });

    await User.update({ statusMsg: statusMsg }, { where: { userId: userId } });
    return res.status(201).json({ msg: "수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserImg(req, res) {
  const { userId } = req.params;
  const { profileImg } = req.body;
  try {
    const userInfo = await User.findOne({ where: { userId: userId } });
    if (!userInfo)
      return res
        .status(400)
        .send({ msg: "요청한 데이터 형식이 올바르지 않습니다." });

    await User.update(
      { profileImg: profileImg },
      { where: { userId: userId } }
    );
    return res.status(201).json({ msg: "수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

module.exports = {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
};
