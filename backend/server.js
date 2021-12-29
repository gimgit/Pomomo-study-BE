const app = require("./app");
const server = require("http").createServer(app);
const cors = require("cors");
const { Room } = require("./models");
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트에서  접속 ✔", socket.id, "님");
  //방만들기

  socket.on(
    "createRoom",
    (roomTittle, roomPassword, round, studyTime, recessTime, openAt) => {
      console.log("createRoom");
      try {
        Room.create({});
      } catch (err) {
        throw err;
      }
      socket.join(roomname);

      console.log({ name, message });
      io.emit("message", { name, message });
    }
  );
});

server.listen(3000, function () {
  console.log("listening on 3000");
});
