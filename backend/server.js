const app = require("./app");
const server = require("http").createServer(app);
require("./socket");

server.listen(3000, function () {
  console.log("listening on 3000");
});
