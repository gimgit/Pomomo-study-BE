require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const passportConfig = require("./passport");
const apiLimit = require("./middlewares/rate-limiter");
// const client = require("./redis");
const router = require("express").Router();

// client.SET("foo", "chal");
// client.GET("foo", (err, value) => {
//   if (err) console.log(err.message);
//   console.log(value);
// });

const app = express();
app.use(cors());
passportConfig();

const { sequelize } = require("./models");

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
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
app.use(express.urlencoded({ extended: false }));

const Router = require("./routes");
app.use("/api/v1", Router);

module.exports = app;
