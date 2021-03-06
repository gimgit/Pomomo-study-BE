const express = require("express");
const router = require("express").Router();
const authCtl = require("../controller/auth");
const validator = require("../middlewares/validator");

router.post("/nameck", validator.validateName, authCtl.nameCheck);
router.post("/nickck", validator.validateNick, authCtl.nickCheck);
router.post("/signup", validator.validatePass, authCtl.createUser);
router.post("/login", authCtl.login);

module.exports = router;
