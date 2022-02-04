const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const client = require("../redis");

function timeSet() {
  // 1. 현재 날짜와 시간, 24시간을 밀리세컨으로 변환
  const now = new Date();
  const dayToMs = 24 * 60 * 60 * 1000;
  // 2. 지난 일요일과 어제의 timestamp 출력.
  const [monday, yesterday] = [
    new Date(now.getTime() - now.getDay() * dayToMs),
    new Date(now.getTime() - dayToMs),
  ];
  let todayStart;
  now.getHours() < 9
    ? (todayStart = `${yesterday.toISOString().substring(0, 11)}00:00:00.000Z`)
    : (todayStart = `${now.toISOString().substring(0, 11)}00:00:00.000Z`);
  const weekStart = `${monday.toISOString().substring(0, 11)}00:00:00.000Z`;

  return { todayStart, weekStart, now };
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
      order: [
        [sequelize.fn("SUM", sequelize.col("studyTime")), "DESC"],
        ["userId", "DESC"],
      ],
      limit: 20,
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

async function monthlyRanking(req, res) {
  const { now } = timeSet();
  const lastMonthEnd = `${now.toISOString().substring(0, 8)}01T00:00:00.000Z`;
  const lastMonthStart = `${now.getFullYear()}-${`0${now.getMonth()}`.slice(
    -2
  )}-01T00:00:00.001Z`;
  const studyRanking = await StudyTime.findAll({
    where: {
      createdAt: {
        [Op.between]: [lastMonthStart, lastMonthEnd],
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
    order: [
      [sequelize.fn("SUM", sequelize.col("studyTime")), "DESC"],
      ["userId", "DESC"],
    ],
    limit: 10,
  });
  for (let i = 0; i < studyRanking.length; i++) {
    let userName = studyRanking[i].User.nick;
    let studyRecord = studyRanking[i].dataValues.weeklyRecord;
    client.ZADD("test", { score: studyRecord, value: userName });
  }
  return res.status(200).send({ msg: "월간 랭킹 갱신" });
}

async function showMonthlyRanking(req, res) {
  const studyRecord = await client.zRangeWithScores("test", 0, -1);
  const recordLength = studyRecord.length;
  const monthlyRank = [];

  for (let i = 0; i < recordLength; i++) {
    monthlyRank.push(studyRecord.pop());
  }

  return res.status(200).send(monthlyRank);
}

module.exports = {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
  showRanking,
  monthlyRanking,
  showMonthlyRanking,
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
