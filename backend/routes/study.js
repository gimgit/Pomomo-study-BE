const express = require("express");
const router = require("express").Router();
const studyCtl = require("../controller/study");

const authorization = require("../middlewares/auth-middlewares");

router.get("/:userId/addTime", studyCtl.addTime);

module.exports = router;
