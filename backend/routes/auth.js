const express = require("express");
const router = require("express").Router();
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

module.exports = router;
