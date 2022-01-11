const express = require("express");
const router = require("express").Router();
const mypageCtl = require("../controller/user");
const upload = require("../middlewares/upload");
const { validateNick } = require("../middlewares/validator");

const authorization = require("../middlewares/auth-middlewares");

router.get("/mypage", authorization, mypageCtl.checkUserInfo);
router.put("/info", authorization, mypageCtl.updateUserInfo);
router.put("/status", authorization, mypageCtl.updateUserStatus);
router.put(
  "/profileImg",
  authorization,
  upload.single("file"),
  mypageCtl.updateUserImg
);

module.exports = router;
