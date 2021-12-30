const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

router.get("/:userId/keyword", studyRoomCtl.keywordSearch);
router.get("/:userId/recommend", studyRoomCtl.catRecommend);

module.exports = router;
