const express = require("express");
const router = require("express").Router();
const mypageCtl = require("../controller/user");

const authorization = require("../middlewares/auth-middlewares");

router.get("/mypage", authorization, mypageCtl.checkUserInfo);
router.put("/info", authorization, mypageCtl.updateUserInfo);
router.put("/status", authorization, mypageCtl.updateUserStatus);
router.put("/profileImg", authorization, mypageCtl.updateUserImg);

module.exports = router;
