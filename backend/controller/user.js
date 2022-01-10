const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function checkUserInfo(req, res) {
  const userId = res.locals.user.userId;
  let [today, tomorrow, yesterday] = [
    new Date(Date.now() + 9 * 60 * 60 * 1000),
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  ];
  let [year, month, dayAfter] = [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.slice(-2),
    `0${today.getDate() - 1}`.slice(-2),
  ];
  let [todayDate, dayBefore] = [
    `0${yesterday.getDate()}`.slice(-2),
    `0${yesterday.getDate() - 1}`.slice(-2),
  ];
  let todayStart;
  let todayEnd;

  let isDawn = new Date().getHours();
  isDawn < 4
    ? (todayStart = `${year}-${month}-${dayBefore}T19:00:00.000Z`)
    : (todayStart = `${year}-${month}-${todayDate}T19:00:00.000Z`);
  isDawn < 4
    ? (todayEnd = `${year}-${month}-${todayDate}T19:00:00.000Z`)
    : (todayEnd = `${year}-${month}-${dayAfter}T19:00:00.000Z`);

  // 04시를 기점으로 오늘 공부시간 가져오는 기준일자 달라짐
  // ec2서버 +9시간 추가되는것을 반영하여 시간 설정함.

  try {
    const userInfo = await User.findAll({
      where: { userId: userId },
      attributes: { exclude: ["password"] },
    });
    console.log(userInfo);
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

    return res.status(200).send({
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
  const userId = res.locals.user.userId;
  const { category, nick } = req.body;
  try {
    const userInfo = await User.findOne({
      where: { userId: userId },
    });
    if (!userInfo) return res.status(400).send("err");
    let userNewInfo = {};
    if (nick) userNewInfo.nick = nick;
    if (category) userNewInfo.category = category;
    await User.update(userNewInfo, { where: { userId: userId } });
    return res.status(201).send({ msg: "수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "이미 존재하는 닉네임 또는 요청하는 데이터 형식이 올바르지 않습니다.",
    });
  }
}
async function updateUserStatus(req, res) {
  const userId = res.locals.user.userId;
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
  const userId = res.locals.user.userId;
  const profileImg = req.file.location;

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
