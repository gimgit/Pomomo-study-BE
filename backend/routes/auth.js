const express = require("express");
const router = require("express").Router();
const authCtl = require("../controller/auth");
const validator = require("../middlewares/validator");

router.post("/nameck", validator.validateAuth, authCtl.nameCheck);
router.post("/nickck", validator.validateAuth, authCtl.nickCheck);
router.post("/signup", validator.validatePass, authCtl.createUser);
router.post("/login", authCtl.login);

module.exports = router;
