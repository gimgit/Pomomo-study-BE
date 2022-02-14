// const { server, https } = require("./socket");
const { server } = require("./socket");
// https.listen(443, () => {
//   console.log("htts server on 443");
// });

server.listen(3000, () => {
  console.log("http server on 3000");
});
