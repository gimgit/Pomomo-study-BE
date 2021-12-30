const app = require("./app");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트에서  접속 ✔", socket.id, "님");

  socket.on("message", ({ name, message }) => {
    console.log({ name, message });
    io.emit("message", { name, message });
  });
});
