const express = require("express");
const router = require("express").Router();
const mypageCtl = require("../controller/user");
const upload = require("../middlewares/upload");

const authorization = require("../middlewares/auth-middlewares");

router.get("/mypage", authorization, mypageCtl.checkUserInfo);
router.put("/:userId/info", mypageCtl.updateUserInfo);
router.put("/:userId/status", mypageCtl.updateUserStatus);
router.put(
  "/:userId/profileImg",
  upload.single("file"),
  mypageCtl.updateUserImg
);

module.exports = router;
