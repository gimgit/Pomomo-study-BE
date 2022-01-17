const express = require("express");
const router = require("express").Router();
const passport = require("passport");
const authCtl = require("../controller/auth");
const {
  validateName,
  validateNick,
  validatePass,
  validateRegister,
} = require("../middlewares/validator");

router.post("/nameck", validateName, authCtl.nameCheck);
router.post("/nickck", validateNick, authCtl.nickCheck);
router.post("/signup", validateRegister, validatePass, authCtl.createUser);
router.post("/login", authCtl.login);

//카카오
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
router.get("/kakao", passport.authenticate("kakao"));
// ? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get("/kakao/callback", authCtl.kakaoCallback);
//? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.

//구글
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", authCtl.googleCallback);

module.exports = router;
