const express = require("express");
const router = require("express").Router();
const studyCtl = require("../controller/studyTimer");

const authorization = require("../middlewares/auth-middlewares");

router.get("/:roomId", studyCtl.syncTimer);
router.post("/:userId/addTime", studyCtl.addTime);

module.exports = router;
