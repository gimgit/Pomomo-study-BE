require("dotenv").config();
const express = require("express");
const path = require("path");
// const server = require('./server')
const cors = require("cors");
const app = express();
app.use(cors());

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

module.exports = app;
