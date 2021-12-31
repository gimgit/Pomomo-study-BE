const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let [today, tomorrow, yesterday] = [
  new Date(Date.now() + 9 * 60 * 60 * 1000),
  new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
];
let [year, month, date] = [
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate(),
];
let [nextDate, dayBefore] = [tomorrow.getDate(), yesterday.getDate()];

async function checkUserInfo(req, res) {
  const { userId } = req.params;
  let todayStart;
  let todayEnd;

  let isDawn = new Date().getHours();
  console.log(isDawn);
  isDawn < 4
    ? (todayStart = `${year}-${month}-${dayBefore}T04:00:00.000Z`)
    : (todayStart = `${year}-${month}-${date}T04:00:00.000Z`);
  isDawn < 4
    ? (todayEnd = `${year}-${month}-${date}T04:00:00.000Z`)
    : (todayEnd = `${year}-${month}-${nextDate}T04:00:00.000Z`);
  // 4시를 기점으로 오늘 공부시간 가져오는 기준시간 달라짐

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
