const { StudyTime } = require("../models");

async function startPomodoro(req, res) {
  const { userId } = req.params;
  const { purpose, studyTime } = req.body;
  try {
    await StudyTime.create({
      userId: userId,
      purpose: purpose,
      studyTime: studyTime,
    });
    res.status(201).send({ msg: "작성완료" });
  } catch (err) {
    console.log(err);
  }
}

async function endPomodoro(req, res) {
  const { userId } = req.params;
  const { purpose, studyTime } = req.body;
  try {
    await StudyTime.create({
      userId: userId,
      purpose: purpose,
      studyTime: studyTime,
    });
    res.status(201).send({ msg: "작성완료" });
  } catch (err) {
    console.log(err);
  }
}

async function recessTime(req, res) {
  const { userId } = req.params;
  const { purpose, studyTime } = req.body;
  try {
    await StudyTime.create({
      userId: userId,
      purpose: purpose,
      studyTime: studyTime,
    });
    res.status(201).send({ msg: "작성완료" });
  } catch (err) {
    console.log(err);
  }
}

async function addTime(req, res) {
  const { userId } = req.params;
  const { purpose, studyTime } = req.body;
  try {
    await StudyTime.create({
      userId: userId,
      purpose: purpose,
      studyTime: studyTime,
    });
    res.status(201).send({ msg: "작성완료" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addTime,
};
