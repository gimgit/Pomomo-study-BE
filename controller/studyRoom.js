const { Room, User, PersonInRoom } = require("../models");
const { Sequelize } = require("sequelize");

async function allRoomList(req, res) {
  try {
    const allRoom = await Room.findAll({
      attributes: {
        exclude: ["roomPassword"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PersonInRoom,
          as: "peopleInRoom",
          attributes: ["userId", "createdAt", "nick"],
          raw: true,
        },
      ],
    });
    const startedRoom = await Room.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("isStarted")), "count"],
      ],
    });
    return res.status(200).send({ list: allRoom, startedCnt: startedRoom });
  } catch (err) {
    return res
      .status(400)
      .send({ msg: "스터디룸 리스트 조회에 실패했습니다." });
  }
}

async function keywordList(req, res) {
  const { roomPurpose } = req.params;
  try {
    const keywordRoom = await Room.findAll({
      where: { purpose: roomPurpose },
      attributes: { exclude: ["roomPassword"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PersonInRoom,
          as: "peopleInRoom",
          attributes: ["userId", "createdAt", "nick"],
          raw: true,
        },
      ],
    });
    const startedRoom = await Room.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("isStarted")), "count"],
      ],
      where: { purpose: roomPurpose },
    });
    res.status(200).send({ list: keywordRoom, startedCnt: startedRoom });
  } catch (err) {
    return res
      .status(400)
      .send({ msg: "해당 키워드의 스터디룸 리스트 조회에 실패했습니다." });
  }
}

async function createRoom(req, res) {
  try {
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

    // 방이름 중복 체크
    const existRoom = await Room.findOne({
      where: { roomTittle: roomTittle },
    });
    if (existRoom) {
      return res.status(400).send({ msg: "방이름이 중복됩니다" });
    }

    if (private == 1) {
      if (roomPassword.length < 4) {
        return res.status(400).send({ msg: "비밀번호는 4글자 이상입니다." });
      }
    }

    const openAtTime = Date.now() + openAt * 60 * 1000;
    const newRoom = await Room.create({
      roomTittle,
      roomPassword,
      private,
      purpose,
      round,
      studyTime,
      recessTime,
      openAt: openAtTime,
    });

    return res.status(200).send({ msg: "완료", newRoomId: newRoom.roomId });
  } catch (err) {
    res.status(400).send({ msg: "스터디룸 생성에 실패하였습니다." });
  }
}

async function checkRoomPw(req, res) {
  const { roomId } = req.params;
  const { roomPassword } = req.body;
  const { userId } = res.locals.user;

  try {
    let room = await Room.findOne({
      where: { roomId },
      raw: true,
    });
    if (roomPassword != room.roomPassword) {
      return res.status(400).send({
        msg: "비공개방 패스워드가 불일치합니다",
      });
    }
    return res.status(200).send({ msg: "비밀번호 일치", roomId, userId });
  } catch (err) {
    return res.status(400).send({
      msg: "비공개방 입장에 실패하였습니다.",
    });
  }
}

async function enterRoom(req, res) {
  const { roomId } = req.params;
  const { userId, nick } = res.locals.user;
  const [existRoom, existUser, peopleCnt] = [
    await Room.findOne({
      where: { roomId },
      raw: true,
    }),
    await PersonInRoom.findOne({
      where: { roomId, userId },
    }),
    (
      await PersonInRoom.findOne({
        where: { roomId },
        raw: true,
        attributes: [[Sequelize.fn("COUNT", Sequelize.col("userId")), "count"]],
      })
    ).count,
  ];
  try {
    if (existUser)
      return res.status(400).send({
        msg: "이미 입장한 방입니다.",
      });

    if (!existRoom)
      return res.status(400).send({
        msg: "존재하지 않는 방입니다.",
      });

    if (peopleCnt > 5) {
      return res.status(400).send({
        msg: "입장불가, 6명 초과",
      });
    }

    await PersonInRoom.create({ userId, roomId, nick });
    return res.status(201).send({ msg: "입장 완료", room: existRoom });
  } catch (err) {
    res.status(400).send({
      msg: "공개방 입장에 실패하였습니다.",
    });
  }

  // 비공개방 입장시 필요
  // switch (parseInt(existRoom.private)) {
  //   case 0:
  //     // 공개방 입장
  //     try {
  //       await PersonInRoom.create({ userId, roomId, nick });
  //       return res.status(201).send({ msg: "입장 완료", room: existRoom });
  //     } catch (err) {
  //       return res.status(400).send({
  //         msg: "공개방 입장에 실패하였습니다.",
  //       });
  //     }
  //   case 1:
  //     // 비공개방 입장
  //     if (existRoom.roomPassword != roomPassword) {
  //       return res.status(400).send({
  //         msg: "비밀번호를 확인해주세요.",
  //       });
  //     } else {
  //       try {
  //         await PersonInRoom.create({ userId, roomId, nick: user.nick });
  //         return res.status(201).send({ msg: "입장 완료", room: existRoom });
  //       } catch (err) {
  //         return res.status(400).send({
  //           msg: "비공개방 입장에 실패하였습니다.",
  //         });
  //       }
  //     }
  // }
}

async function exitRoom(req, res) {
  try {
    const { roomId } = req.params;
    const { userId, nick } = res.locals.user;
    const [exsitUser, peopleCnt] = [
      await PersonInRoom.findOne({
        where: { roomId, userId },
        raw: true,
      }),
      (
        await PersonInRoom.findOne({
          where: { roomId },
          raw: true,
          attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("userId")), "count"],
          ],
        })
      ).count,
    ];
    if (!exsitUser)
      return res.status(400).send({ msg: "이미 퇴장한 방입니다." });

    if (peopleCnt == 1) {
      console.log(`마지막 ${nick} 사용자 퇴장. ${roomId}번 방 삭제 `);
      await PersonInRoom.destroy({
        where: { userId, roomId },
      });
      await Room.destroy({
        where: { roomId },
      });
      return res.status(201).send({ msg: "마지막 유저 퇴장, 방 삭제" });
    } else {
      console.log(`${nick} 사용자 퇴장`);
      await PersonInRoom.destroy({
        where: { userId, roomId },
      });
      return res.status(201).send({ msg: "퇴장 완료" });
    }
  } catch (err) {
    return res.status(400).send({
      msg: "잘못된 퇴장 요청입니다.",
    });
  }
}

module.exports = {
  keywordList,
  allRoomList,
  createRoom,
  enterRoom,
  exitRoom,
  checkRoomPw,
};
