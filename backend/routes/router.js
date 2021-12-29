const Router = require('express').Router();

const { updateUserRecord } = require('./controller/studyTimer');
const {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
} = require('./controller/user');

Router.post('/user/recordTime', updateUserRecord);

Router.get('/user/:userId/mypage', checkUserInfo);
Router.put('/user/:userId/info', updateUserInfo);
Router.put('/user/:userId/status', updateUserStatus);
Router.put('/user/:userId/profileImg', updateUserImg);

module.exports = Router;
