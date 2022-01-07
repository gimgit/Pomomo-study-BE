require("dotenv").config();
const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

const { sequelize } = require("./models");

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Router = require("./routes");
app.use("/api/v1", Router);

sslServer.listen(3443, function () {
  console.log("https listening on 3443");
});

module.exports = app;
