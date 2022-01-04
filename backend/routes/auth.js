const express = require("express");
const router = require("express").Router();
const authCtl = require("../controller/auth");

router.post("/nameck", authCtl.nameCheck);
router.post("/nickck", authCtl.nickCheck);
router.post("/signup", authCtl.createUser);
router.post("/login", authCtl.login);

module.exports = router;
