const express = require("express");
const router = require("express").Router();
const postCtl = require("../controller/post");
const authorization = require("../middlewares/auth-middlewares.js");

router.post("/", authorization, postCtl.postBoard);

module.exports = router;
