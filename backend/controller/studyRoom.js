const { Room, User, PersonInRoom } = require("../models");

async function catRecommend(req, res) {
  const { userId } = req.params;
  const Usertype = await User.findOne({
    where: { userId: userId },
    attributes: ["category"],
    raw: true,
  });
  let basis = Usertype.category;
  switch (basis) {
    case "중3":
      console.log("중3");
      break;
    case "예비고":
      console.log("예비고");
      res.status(200).send("ok1");
      break;
    case "고1":
      console.log("고1입니다");
      res.status(200).send("ok2");
      break;
    case "고2":
      console.log("고2");
      break;
    case "예비고3":
      console.log("예비고3");
      break;
    case "고3":
      console.log("고3");
      break;
    case "대학생":
      console.log("대학생");
      break;
    case "일반":
      console.log("일반");
      break;
  }
}

async function keywordSearch(req, res) {
  let { roomPurpose } = req.body;

  switch (parseInt(roomPurpose)) {
    case 1:
      console.log("고입");
      const HighschoolEnter = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
      });
      res.status(200).send({ result: HighschoolEnter });
      break;
    case 2:
      console.log("내신");
      const exam = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        inclue: [PersonInRoom],
      });
      res.status(200).send({ result: exam });
      break;
    case 3:
      console.log("수능");
      const CollegeEnter = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
      });
      res.status(200).send({ result: CollegeEnter });
      break;
    case 4:
      console.log("공시");
      const CivilService = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
      });
      res.status(200).send({ result: CivilService });
      break;
    case 5:
      console.log("자격증");
      const licenseTest = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
      });
      res.status(200).send({ result: licenseTest });
      break;
  }
}

module.exports = {
  catRecommend,
  keywordSearch,
};
