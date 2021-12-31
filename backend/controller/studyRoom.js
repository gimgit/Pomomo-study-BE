const { Room, User, PersonInRoom } = require("../models");
const { Op } = require("sequelize");

async function allRoomList(req, res) {
  try {
    const allRoom = await Room.findAll({
      attributes: { exclude: ["roomPassword"] },
    });
    return res.status(200).send({ list: allRoom });
  } catch (err) {
    return res
      .status(400)
      .send({ msg: "요청한 데이터 형식이 올바르지 않습니다." });
  }
}

async function catRecommend(req, res) {
  const { userId } = req.params;
  const Usertype = await User.findOne({
    where: { userId: userId },
    attributes: ["category"],
    raw: true,
  });
  let basis = Usertype.category;
  switch (parseInt(basis)) {
    case 0:
      console.log("중3");
      const middleThird = await Room.findAll({
        where: { [Op.or]: [{ purpose: 1 }, { purpose: 0 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: middleThird });
      break;
    case 1:
      console.log("고1");
      const highFirst = await Room.findAll({
        where: { [Op.or]: [{ purpose: 1 }, { purpose: 0 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: highFirst });
      break;
    case 2:
      console.log("고2");
      const highSecond = await Room.findAll({
        where: { [Op.or]: [{ purpose: 2 }, { purpose: 0 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: highSecond });
      break;
    case 3:
      console.log("고3");
      const highThird = await Room.findAll({
        where: { [Op.or]: [{ purpose: 2 }, { purpose: 0 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: highThird });
      break;
    case 4:
      console.log("대학생");
      const collegeStudent = await Room.findAll({
        where: { [Op.or]: [{ purpose: 3 }, { purpose: 4 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: collegeStudent });
      break;
    case 5:
      console.log("일반");
      const ordinary = await Room.findAll({
        where: { [Op.or]: [{ purpose: 4 }, { purpose: 3 }] },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: ordinary });
      break;
  }
}

async function keywordSearch(req, res) {
  const { roomPurpose } = req.body;
  const { userId } = req.params;

  switch (parseInt(roomPurpose)) {
    case 1:
      console.log("자율학습");
      const highschoolEnter = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: highschoolEnter });
      break;
    case 2:
      console.log("시험");
      const exam = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: exam });
      break;
    case 3:
      console.log("수능");
      const collegeEnter = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: collegeEnter });
      break;
    case 4:
      console.log("자격증");
      const civilService = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: civilService });
      break;
    case 5:
      console.log("공시");
      const licenseTest = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: licenseTest });
      break;
    case 6:
      console.log("독서");
      const readBook = await Room.findAll({
        where: { purpose: roomPurpose },
        attributes: { exclude: ["roomPassword"] },
        include: [
          {
            model: PersonInRoom,
            as: "peopleInRoom",
            attributes: ["userId", "createdAt"],
            raw: true,
          },
        ],
      });
      res.status(200).send({ list: readBook });
      break;
  }
}

async function createRoom(req, res) {
  const {
    roomTittle,
    roomPassword,
    private,
    purpose,
    round,
    studyTime,
    recessTime,
    openAt,
  } = req.body;
}

module.exports = {
  catRecommend,
  keywordSearch,
  allRoomList,
};
