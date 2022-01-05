const express = require("express");
const router = require("express").Router();
const mypageCtl = require("../controller/user");

const authorization = require("../middlewares/auth-middlewares");

router.get("/mypage", authorization, mypageCtl.checkUserInfo);
router.put("/:userId/info", authorization, mypageCtl.updateUserInfo);
router.put("/:userId/status", authorization, mypageCtl.updateUserStatus);
router.put("/:userId/profileImg", authorization, mypageCtl.updateUserImg);

module.exports = router;
