const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

async function checkUserInfo(req, res) {
  const { userId } = res.locals.user;
  let today = new Date(Date.now() + 9 * 60 * 60 * 1000);

  let [year, month, dayAfter, todayDate, dayBefore] = [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.slice(-2),
    `0${today.getDate()}`.slice(-2),
    `0${today.getDate() - 1}`.slice(-2),
    `0${today.getDate() - 2}`.slice(-2),
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

  try {
    const userInfo = await User.findOne({
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
  const { userId } = res.locals.user;
  const { category, nick } = req.body;
  try {
    await User.update({ nick, category }, { where: { userId: userId } });
    return res.status(201).send({ msg: "회원정보 수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "이미 존재하는 닉네임 또는 요청하는 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserStatus(req, res) {
  const { userId } = res.locals.user;
  const { statusMsg } = req.body;
  try {
    await User.update({ statusMsg: statusMsg }, { where: { userId } });
    return res.status(201).send({ msg: "상태메시지 수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 상태메시지 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserImg(req, res) {
  const { userId } = res.locals.user;
  const profileImg = req.file.location;
  try {
    await User.update({ profileImg: profileImg }, { where: { userId } });
    return res.status(201).json({ msg: "프로필 이미지 수정완료!" });
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 프로필 이미지 형식이 올바르지 않습니다.",
    });
  }
}

module.exports = {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
};
