const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function checkUserInfo(req, res) {
  let now = new Date(Date.now() + 32400000);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let startDate = now.getDate() - 1;
  let todayStart = `${year}-${month}-${startDate}T04:00:00.000Z`;
  let todayEnd = `${year}-${month}-${date}T04:00:00.000Z`;
  console.log(now);
  console.log(todayStart);
  console.log(todayEnd);

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
    const existNick = await User.findOne({
      where: { nick: nick },
    });
    if (existNick)
      return res
        .status(400)
        .send({ errorMessage: "이미 사용중인 닉네임입니다." });
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
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
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
