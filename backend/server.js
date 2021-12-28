const app = require('./app')
const server = require('http').createServer(app)
const cors = require('cors')
app.use(cors())
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('클라이언트에서  접속 ✔', socket.id, '님')

  socket.on('message', ({ name, message }) => {
    console.log({ name, message })
    io.emit('message', { name, message })
  })
})

server.listen(3000, function () {
  console.log('listening on 3000')
})

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     Credential: true,
//   },
// });

// io.on("connection", (socket) => {
//   socket["nick"] = "anon";
//   io.emit("join", `user : ${socket.nick} on`);

//   socket.on("message", ({ name, message }) => {
//     console.log({ name, message });
//     io.emit("message", { name, message });
//   });
//   socket.on("disconnect", () => {
//     console.log("client off");
//     io.emit("disconnection", `${socket.nick} leave the room`);
//   });
// });
