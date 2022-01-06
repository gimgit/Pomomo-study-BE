const app = require("./app");
const server = require("http").createServer(app);
const { Room, PersonInRoom, StudyTime } = require("./models");
const { Op } = require("sequelize");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  let userID = null;
  let roomID = null;
  let peerID = null;
  let nickname = null;
  let streamID = null;

  console.log("클라이언트 : ", socket.id, "님");
  socket.on("join-room", async (roomId, peerId, userId, nick, streamId) => {
    try {
      userID = userId;
      roomID = roomId;
      peerID = peerId;
      nickname = nick;
      streamID = streamId;

      socket.join(roomId);
      console.log(roomId, "방에 입장");
      socket.broadcast
        .to(roomId)
        .emit("user-connected", peerId, nick, streamId);
      const room = await Room.findByPk(roomId);
      const currentRound = room.currentRound;
      const totalRound = room.round;
      const openAt = room.openAt;
      socket.emit("restTime", currentRound, totalRound, openAt);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("endRest", async (roomId, currentRound) => {
    const room = await Room.findByPk(roomId);
    const openAt = Date.now() + room.studyTime * 60 * 1000;
    await Room.update(
      {
        currentRound,
        openAt,
        isStarted: 1,
      },
      { where: { roomId } }
    );
    socket.emit("studyTime", currentRound, room.round, openAt);
  });

  socket.on("endStudy", async (roomId, userId, nick) => {
    const room = await Room.findByPk(roomId);
    const openAt = Date.now() + room.recessTime * 60 * 1000;
    const currentRound = room.currentRound;
    const totalRound = room.round;

    await Room.update(
      {
        openAt,
        isStarted: 0,
      },
      { where: { roomId } }
    );

    await StudyTime.create({
      userId: userId,
      studyTime: room.studyTime,
    });
    socket.emit("restTime", currentRound, totalRound, openAt);
  });

  socket.on("totalEnd", async (roomId, userId, nick) => {
    const room = await Room.findByPk(roomId);
    await StudyTime.create({
      userId: userId,
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

    socket.broadcast
      .to(roomID)
      .emit("user-disconnected", peerID, nickname, streamID);

    const PIR_list = await PersonInRoom.findAll({
      where: {
        roomId: roomID,
      },
    });

    if (PIR_list.length === 0) {
      await Room.destroy({ where: { roomId: roomID } });
    }
  });

  socket.on("message", ({ name, message, roomId }) => {
    console.log({ name, message });

    io.to(roomId).emit("message", { name, message });
  });

  socket.on("offer", (offer, peerId, roomId) => {
    console.log("offer 왔습니다!");
    socket.to(roomId).emit("offer", offer, peerId);
  });

  socket.on("answer", (answer, peerId, roomId) => {
    console.log("answer 왔습니다!");
    socket.to(roomId).emit("answer", answer, peerId);
  });

  socket.on("ice", (ice, peerId, roomId) => {
    console.log("ice 왔습니다!");
    socket.to(roomId).emit("ice", ice, peerId);
  });
});

module.exports = server;
