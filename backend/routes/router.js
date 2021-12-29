const Router = require("express").Router();

const { recordStudyTime } = require("./controller/study");
const {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
} = require("./controller/user");
const { AddUser, Login } = require("./controller/user");
const auth = require("../middlewares/auth-middlewares");

//User
Router.post("/user/signup", AddUser);
Router.post("/user/login", Login);
Router.post("/users/recordTime", recordStudyTime);
Router.get("/user/:userId/mypage", checkUserInfo);
Router.put("/user/:userId/info", updateUserInfo);
Router.put("/user/:userId/status", updateUserStatus);
Router.put("/user/:userId/profileImg", updateUserImg);

Router.post("/study/:userId/recordTime", recordStudyTime);

module.exports = Router;
