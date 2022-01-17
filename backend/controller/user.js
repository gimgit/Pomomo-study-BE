const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

function timeSet() {
  // 1. 현재 날짜정보, 오늘 타임스탬프, 오늘 요일 출력
  const now = new Date();
  const [timestamp, day] = [now.getTime(), now.getDay()];
  let weekStart, todayStart;

  // 2. 금주 월요일과 어제의 timestamp 출력.
  const [mondayStamp, yesterdayStamp] = [
    timestamp - (day - 1) * 24 * 60 * 60 * 1000,
    timestamp - 24 * 60 * 60 * 1000,
  ];

  // 3. 현재시각, 년, 월, 오늘날짜, 어제날짜, 금주 월요일 날짜를 출력.
  const [currentTime, year, month, today, yesterday, monday] = [
    now.getHours(),
    now.getFullYear(),
    `0${now.getMonth() + 1}`.slice(-2),
    `0${now.getDate()}`.slice(-2),
    `0${new Date(yesterdayStamp).getDate()}`.slice(-2),
    `0${new Date(mondayStamp).getDate()}`.slice(-2),
  ];

  weekStart = `${year}-${month}-${monday}T00:00:00.000Z`;
  currentTime < 9
    ? (todayStart = `${year}-${month}-${yesterday}T00:00:00.000Z`)
    : (todayStart = `${year}-${month}-${today}T00:00:00.000Z`);

  return { todayStart, weekStart };
}

async function checkUserInfo(req, res) {
  const { userId } = res.locals.user;
  const { todayStart } = timeSet();
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
          [Op.gte]: todayStart,
        },
      },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "today"]],
    });
    console.log(todayStart);
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
  const { weekStart } = timeSet();
  try {
    const studyRanking = await StudyTime.findAll({
      where: {
        createdAt: {
          [Op.gte]: weekStart,
        },
      },
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("studyTime")), "weeklyRecord"],
      ],
      include: [
        {
          model: User,
          as: "User",
          attributes: ["nick", "category"],
        },
      ],
      group: ["userId"],
      order: [[sequelize.fn("SUM", sequelize.col("studyTime")), "DESC"]],
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

// const { userId } = res.locals.user;
// let today = new Date();
// const timestamp = today.getTime();

// // 어제와 내일의 timestamp를 출력합니다.
// const [yesterday, tomorrow] = [
//   timestamp - 24 * 60 * 60 * 1000,
//   timestamp + 24 * 60 * 60 * 1000,
// ];
// // 년, 월, 어제 날짜, 오늘 날짜, 내일 날짜를 출력합니다.
// const [year, month, dayBefore, todayDate, dayAfter] = [
//   today.getFullYear(),
//   `0${today.getMonth() + 1}`.slice(-2),
//   `0${new Date(yesterday).getDate()}`.slice(-2),
//   `0${today.getDate()}`.slice(-2),
//   `0${new Date(tomorrow).getDate()}`.slice(-2),
// ];

// // 현재시각이 09시 이전인 경우 어제 09시 부터 오늘 09시까지의 데이터 출력
// // 현재시각이 09시 이후인 경우 오늘 09시 부터 내일 09시까지의 데이터 출력
// let isNewDay = today.getHours();
// isNewDay < 9
//   ? (todayStart = `${year}-${month}-${dayBefore}T00:00:00.000Z`)
//   : (todayStart = `${year}-${month}-${todayDate}T00:00:00.000Z`);
// isNewDay < 9
//   ? (todayEnd = `${year}-${month}-${todayDate}T00:00:00.000Z`)
//   : (todayEnd = `${year}-${month}-${dayAfter}T00:00:00.000Z`);

// console.log(todayStart);
// console.log(todayEnd);

// const today = new Date();
// const timestamp = today.getTime();
// const day = today.getDay();

// // 금주 월요일의 timestamp를 출력합니다.
// const [startPoint] = [timestamp - (day - 1) * 24 * 60 * 60 * 1000];

// // 년, 월, 월요일 날짜를 출력합니다.
// const [year, month, monday] = [
//   today.getFullYear(),
//   `0${today.getMonth() + 1}`.slice(-2),
//   `0${new Date(startPoint).getDate()}`.slice(-2),
// ];

// const weekStart = `${year}-${month}-${monday}T00:00:01.000Z`;
