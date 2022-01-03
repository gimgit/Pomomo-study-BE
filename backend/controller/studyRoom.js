const { Room, User, PersonInRoom } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function allRoomList(req, res) {
  const allRoom = await Room.findAll({
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
  try {
    return res.status(200).send({ list: allRoom });
  } catch (err) {
    return res
      .status(400)
      .send({ msg: "요청한 데이터 형식이 올바르지 않습니다." });
  }
}

async function recommendList(req, res) {
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

// async function keywordList(req, res) {
//   const { roomPurpose } = req.parmas;

//   switch (parseInt(roomPurpose)) {
//     case 1:
//       console.log("자율학습");
//       const highschoolEnter = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: highschoolEnter });
//       break;
//     case 2:
//       console.log("시험");
//       const exam = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: exam });
//       break;
//     case 3:
//       console.log("수능");
//       const collegeEnter = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: collegeEnter });
//       break;
//     case 4:
//       console.log("자격증");
//       const civilService = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: civilService });
//       break;
//     case 5:
//       console.log("공시");
//       const licenseTest = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: licenseTest });
//       break;
//     case 6:
//       console.log("독서");
//       const readBook = await Room.findAll({
//         where: { purpose: roomPurpose },
//         attributes: { exclude: ["roomPassword"] },
//         include: [
//           {
//             model: PersonInRoom,
//             as: "peopleInRoom",
//             attributes: ["userId", "createdAt"],
//             raw: true,
//           },
//         ],
//       });
//       res.status(200).send({ list: readBook });
//       break;
//   }
// }

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
    isFull,
  } = req.body;

  let existRoom = await Room.findAll({
    where: { roomTittle: roomTittle },
  });
  if (existRoom.length) {
    return res.status(400).send({ msg: "방이름이 중복됩니다" });
  }

  if (parseInt(private) === 0) {
    if (roomPassword) {
      return res
        .status(400)
        .send({ msg: "공개방에는 비밀번호를 입력하지 않습니다" });
    }
  } else if (parseInt(private) === 1) {
    if (roomPassword.length < 4) {
      return res.status(400).send({ msg: "비밀번호는 4글자 이상입니다." });
    }
  }

  let openAtTime = new Date(Date.now() + openAt * 60 * 1000);
  //integer

  try {
    await Room.create({
      roomTittle,
      roomPassword,
      private,
      purpose,
      round,
      studyTime,
      recessTime,
      openAt: openAtTime,
      isFull,
    });
    return res.status(200).send({ msg: "완료" });
  } catch (err) {
    res.status(400).send({ msg: "요청한 데이터 형식이 올바르지 않습니다." });
  }
}

async function enterRoom(req, res) {
  const { roomId, userId } = req.params;

  let [existRoom, existUser, peopleCount] = [
    await Room.findOne({
      where: { roomId: roomId },
    }),
    await PersonInRoom.findOne({
      where: { roomId: roomId, userId: userId },
    }),
    await PersonInRoom.findAll({
      where: { roomId: roomId },
      raw: true,
    }),
  ];

  if (existUser)
    return res.status(400).send({
      msg: "이미 입장한 방입니다.",
    });

  if (!existRoom)
    return res.status(400).send({
      msg: "존재하지 않는 방입니다.",
    });

  if (peopleCount.length > 5) {
    return res.status(400).send({
      msg: "6명 초과",
    });
  } else {
    try {
      await PersonInRoom.create({ userId, roomId });
      return res.status(201).send({ msg: "입장 완료" });
    } catch (err) {
      return res.status(400).send({
        msg: "요청한 데이터 형식이 올바르지 않습니다",
      });
    }
  }
}

async function reconnectRoom(req, res) {}

async function exitRoom(req, res) {
  const { roomId, userId } = req.params;
  let [exitRoom, peopleCount] = [
    await PersonInRoom.findOne({
      where: { roomId: roomId, userId: userId },
      raw: true,
    }),
    await PersonInRoom.findAll({
      where: { roomId: roomId },
      raw: true,
    }),
  ];
  if (!exitRoom)
    return res
      .status(400)
      .send({ msg: "요청한 데이터 형식이 올바르지 않습니다" });
  try {
    switch (parseInt(peopleCount.length)) {
      case 1:
        console.log(`마지막 ${userId}번 사용자 퇴장`);
        await PersonInRoom.destroy({
          where: { userId: userId, roomId: roomId },
        });
        await Room.destroy({
          where: { roomId: roomId },
        });
        res.status(201).send({ msg: "마지막 유저 퇴장, 방 삭제" });
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        console.log(`${userId}번 사용자 퇴장`);
        await PersonInRoom.destroy({
          where: { userId: userId, roomId: roomId },
        });
        res.status(201).send({ msg: "퇴장 완료" });
        break;
    }
  } catch (err) {
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다",
    });
  }
}

module.exports = {
  recommendList,
  // keywordList,
  allRoomList,
  createRoom,
  enterRoom,
  reconnectRoom,
  exitRoom,
};
