const { StudyTime } = require('../../models');

async function updateUserRecord(req, res) {
  const { userId } = req.params;
  const { purpose, studyTime } = req.body;
  try {
    const user = await StudyTime.create({
      userId: userId,
      purpose: purpose,
      studyTime: studyTime,
    });
    res.status(201).json({ code: 201, msg: '작성완료' });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  updateUserRecord,
};
