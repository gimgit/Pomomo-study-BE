const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

async function checkUserInfo(req, res) {
  const { userId } = res.locals.user;
  let today = new Date();
  const timestamp = today.getTime();

  // 어제와 내일의 timestamp를 출력합니다.
  const [yesterday, tomorrow] = [
    timestamp - 24 * 60 * 60 * 1000,
    timestamp + 24 * 60 * 60 * 1000,
  ];
  // 년, 월, 어제 날짜, 오늘 날짜, 내일 날짜를 출력합니다.
  const [year, month, dayBefore, todayDate, dayAfter] = [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.slice(-2),
    `0${new Date(yesterday).getDate()}`.slice(-2),
    `0${today.getDate()}`.slice(-2),
    `0${new Date(tomorrow).getDate()}`.slice(-2),
  ];

  // 현재시각이 04시 이전인 경우 어제 04시 부터 오늘 04시까지의 데이터 출력
  // 현재시각이 04시 이후인 경우 오늘 04시 부터 내일 04시까지의 데이터 출력
  let isDawn = today.getHours();
  isDawn < 4
    ? (todayStart = `${year}-${month}-${dayBefore}T04:00:00.000Z`)
    : (todayStart = `${year}-${month}-${todayDate}T04:00:00.000Z`);
  isDawn < 4
    ? (todayEnd = `${year}-${month}-${todayDate}T04:00:00.000Z`)
    : (todayEnd = `${year}-${month}-${dayAfter}T04:00:00.000Z`);

  console.log(todayStart);
  console.log(todayEnd);

  try {
    const userInfo = await User.findOne({
      where: { userId: userId },
      attributes: { exclude: ["password"] },
    });
    const studyRecord = await StudyTime.findOne({
      where: { userId: userId },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "total"]],
    });
    const todayRecord = await StudyTime.findOne({
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

async function showRanking(req, res) {
  const today = new Date();
  const timestamp = today.getTime();
  const day = today.getDay();

  // 월요일과 일요일의 timestamp를 출력합니다.
  const [startPoint, endPoint] = [
    timestamp - (day - 1) * 24 * 60 * 60 * 1000,
    timestamp + (7 - day) * 24 * 60 * 60 * 1000,
  ];

  // 년, 월, 월요일 날짜, 일요일 날짜를 출력합니다.
  const [year, month, monday, sunday] = [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.slice(-2),
    `0${new Date(startPoint).getDate()}`.slice(-2),
    `0${new Date(endPoint).getDate()}`.slice(-2),
  ];

  let weekStart = `${year}-${month}-${monday}T00:00:01.000Z`;
  let weekEnd = `${year}-${month}-${sunday}T00:00:00.000Z`;

  try {
    const studyRanking = await StudyTime.findAll({
      where: {
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("studyTime")), "weeklyRecord"],
      ],
      group: ["userId"],
    });
    return res.status(200).send({
      studyRanking,
    });
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
  showRanking,
};
