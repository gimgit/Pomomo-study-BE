const Router = require("express").Router();

const { recordStudyTime } = require("./controller/study");
const {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
} = require("./controller/user");

Router.post("/study/:userId/recordTime", recordStudyTime);

Router.get("/user/:userId/mypage", checkUserInfo);
Router.put("/user/:userId/info", updateUserInfo);
Router.put("/user/:userId/status", updateUserStatus);
Router.put("/user/:userId/profileImg", updateUserImg);

module.exports = Router;
