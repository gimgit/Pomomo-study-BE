const Router = require("express").Router();

const { recordStudyTime } = require("./controller/study");
const {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
  AddUser,
  Login,
} = require("./controller/user");
const auth = require("../middlewares/auth-middlewares");

Router.post("/study/:userId/recordTime", recordStudyTime);

Router.post("/user/signup", AddUser);
Router.post("/user/login", Login);

Router.get("/:userId/mypage", checkUserInfo);
Router.put("/:userId/info", updateUserInfo);
Router.put("/:userId/status", updateUserStatus);
Router.put("/:userId/profileImg", updateUserImg);

module.exports = Router;
