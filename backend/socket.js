const app = require("./app");
const fs = require("fs");
const sequelize = require("sequelize");
const { Op } = sequelize;
// const options = {
//   // letsencrypt로 받은 인증서 경로를 입력
//   ca: fs.readFileSync("/etc/letsencrypt/live/hanghaelog.shop/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/hanghaelog.shop/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/hanghaelog.shop/cert.pem"),
// };
const server = require("http").createServer(app);
// const https = require("https").createServer(options, app);

const { Room, PersonInRoom, StudyTime } = require("./models");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  let roomID;
  let peerID;
  let userID;
  let nickname;
  let streamID;
  let statusMsg;
  console.log("클라이언트 : ", socket.id, "님");

  socket.on(
    "join-room",
    async (roomId, peerId, userId, nick, streamId, status) => {
      roomID = roomId;
      peerID = peerId;
      userID = userId;
      streamID = streamId;
      statusMsg = status;
      nickname = nick;
      try {
        socket.join(roomID);
        console.log(roomID, "방에 입장");
        socket
          .to(roomID)
          .emit("user-connected", peerID, nickname, streamID, statusMsg);
        const users = await PersonInRoom.findAll({
          where: {
            roomId: roomID,
            userId: { [Op.not]: userID },
          },
        });
        socket.emit("welcome", users, users.length);
        const room = await Room.findByPk(roomID);
        const currentRound = room.currentRound;
        const totalRound = room.round;
        const openAt = room.openAt;

        socket.emit("restTime", currentRound, totalRound, openAt);
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("endRest", async (currentRound) => {
    const room = await Room.findByPk(roomID);
    const openAt = Date.now() + room.studyTime * 60 * 1000;
    await Room.update(
      {
        currentRound,
        openAt,
        isStarted: 1,
      },
      { where: { roomID } }
    );
    socket.emit("studyTime", currentRound, room.round, openAt);
  });

  socket.on("endStudy", async () => {
    const room = await Room.findByPk(roomID);
    const openAt = Date.now() + room.recessTime * 60 * 1000;
    const currentRound = room.currentRound;
    const totalRound = room.round;

    await Room.update(
      {
        openAt,
        isStarted: 0,
      },
      { where: { roomID } }
    );

    await StudyTime.create({
      userId: userID,
      studyTime: room.studyTime,
    });
    socket.emit("restTime", currentRound, totalRound, openAt);
  });

  socket.on("totalEnd", async () => {
    const room = await Room.findByPk(roomID);
    await StudyTime.create({
      userId: userID,
      studyTime: room.studyTime,
    });
    const endTime = Date.now() + 60000;
    socket.emit("totalEnd", endTime);
  });

  socket.on("disconnect", async () => {
    console.log(`${userID}님이 ${roomID}번방에서 나가셨습니다!`);

    await PersonInRoom.destroy({
      where: {
        userId: userID,
        roomId: roomID,
      },
    });

    socket.to(roomID).emit("user-disconnected", peerID, nickname, streamID);

    const PIR_list = await PersonInRoom.findAll({
      where: {
        roomId: roomID,
      },
    });

    if (PIR_list.length === 0) {
      await Room.destroy({ where: { roomId: roomID } });
    }
  });

  socket.on("message", (message) => {
    socket.to(roomID).emit("message", nickname, message);
  });

  socket.on("join-chatRoom", (roomId, userId, userNickname) => {
    socket.join(roomId);
  });

  // socket.on("offer", (offer, peerId, roomId) => {
  //   console.log("offer 왔습니다!");
  //   socket.to(roomId).emit("offer", offer, peerId);
  // });

  // socket.on("answer", (answer, peerId, roomId) => {
  //   console.log("answer 왔습니다!");
  //   socket.to(roomId).emit("answer", answer, peerId);
  // });

  // socket.on("ice", (ice, peerId, roomId) => {
  //   console.log("ice 왔습니다!");
  //   socket.to(roomId).emit("ice", ice, peerId);
  // });
});

// module.exports = { server, https };
module.exports = { server };

// const url = process.env.REACT_APP_API_URL;
// const socket = io.connect(url, { transports: ["websocket"] });

// const url = process.env.REACT_APP_API_URL;
// const socket = io(url, { transports: ["websocket"] });
