const app = require("./app");
const server = require("http").createServer(app);
const {} = require("./models");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트에서  접속 ✔", socket.id, "님");

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("welcome");
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

  socket.on("message", ({ name, message }) => {
    console.log({ name, message });
    io.emit("message", { name, message });
  });
});
