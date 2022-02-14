const redis = require("redis");
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const client = redis.createClient({
  url,
  password: process.env.REDIS_HOST_PASSWORD,
});

client.connect();
client.on("connect", () => {
  console.log("client connected");
});

client.on("ready", () => {
  console.log("client connected and ready");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("client disconnected");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
