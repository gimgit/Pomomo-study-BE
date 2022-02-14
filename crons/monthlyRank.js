const cron = require("node-cron");
const { StudyTime, User, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const client = require("../redis");

async function updateRanking() {
  cron.schedule("1 0 1 * *", () => {
    timeSet();
  });
}

const timeSet = function () {
  console.log("timeSet");
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 0, 0, 0);
  return (async function createNewRaking() {
    console.log("createNewRaking");
    const redisTable = "monthlyRanking";
    const studyRanking = await StudyTime.findAll({
      where: {
        createdAt: {
          [Op.between]: [lastMonth, lastMonthEnd],
        },
      },
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("studyTime")), "monthlyRecord"],
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
      limit: 50,
    });
    try {
      client.del(redisTable);
      for (let i = 0; i < studyRanking.length; i++) {
        let userName = studyRanking[i].User.nick;
        let studyRecord = studyRanking[i].dataValues.monthlyRecord;
        client.ZADD(redisTable, { score: studyRecord, value: userName });
      }

      console.log("매월 1일 월간 랭킹 갱신");
    } catch (error) {
      console.logo(error);
    }
  })();
};

module.exports = { updateRanking };
