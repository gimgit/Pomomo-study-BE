const express = require("express");
const router = require("express").Router();
const mypageCtl = require("../controller/user");

const authorization = require("../middlewares/auth-middlewares");

router.get("/:userId/mypage", mypageCtl.checkUserInfo);
router.put("/:userId/info", mypageCtl.updateUserInfo);
router.put("/:userId/status", mypageCtl.updateUserStatus);
router.put("/:userId/profileImg", mypageCtl.updateUserImg);

module.exports = router;
