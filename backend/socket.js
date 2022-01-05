const app = require("./app");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트 : ", socket.id, "님");
  const date3 = new Date();
  const ms3 = date3.getTime() + 5000;
  socket.emit("restTime", 3, ms3);
  socket.on("join-room", (roomId, peerId, userId, username, streamId) => {
    socket.join(roomId);

    console.log(roomId, "방에 입장");
    socket.broadcast
      .to(roomId)
      .emit("user-connected", peerId, username, streamId);
  });
  socket.on("totalEnd", () => {
    const date5 = new Date();
    const ms5 = date5.getTime() + 300000;
    socket.emit("totalEnd", ms5);
  });
  socket.on("studyTime", (round) => {
    const date1 = new Date();
    const ms1 = date1.getTime() + 5000;
    socket.emit("time", ms1);
  });
  socket.on("endRest", (round) => {
    const date2 = new Date();
    const ms2 = date2.getTime() + 5000;
    socket.emit("studyTime", 3, ms2);
  });
  socket.on("endStudy", (round) => {
    const date4 = new Date();
    const ms4 = date4.getTime() + 5000;
    socket.emit("restTime", 3, ms4);
  });
  socket.on("removeRoom", () => {
    console.log("방 삭제하겠습니다!");
  });
  socket.on("message", ({ name, message, roomId }) => {
    console.log({ name, message });
    io.to(roomId).emit("message", { name, message });
  });
  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice", (ice, roomId) => {
    socket.to(roomId).emit("ice", ice);
  });
});

module.exports = server;
