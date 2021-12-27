const app = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    Credential: true,
  },
});

io.on("connection", (socket) => {
  socket["nick"] = "anon";
  io.emit("join", `user : ${socket.nick} on`);

  socket.on("message", ({ name, message }) => {
    console.log({ name, message });
    io.emit("message", { name, message });
  });
  socket.on("disconnect", () => {
    console.log("client off");
    io.emit("disconnection", `${socket.nick} leave the room`);
  });
});

server.listen(3000, function () {
  console.log("listening on 3000");
});
