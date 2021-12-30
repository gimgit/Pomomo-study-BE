const express = require("express");
const router = require("express").Router();
const authCtl = require("../controller/auth");

router.post("/signup", authCtl.CreateUser);
router.post("/login", authCtl.Login);

module.exports = router;
