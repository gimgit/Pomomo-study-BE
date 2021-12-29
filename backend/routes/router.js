const Router = require("express").Router();

const { recordStudyTime } = require("./controller/studyTimer");
const { AddUser, Login } = require("./controller/user");
const auth = require("../middlewares/auth-middlewares");

//User
Router.post("/user/signup", AddUser);
Router.post("/user/login", Login);
Router.post("/users/recordTime", recordStudyTime);

module.exports = Router;
