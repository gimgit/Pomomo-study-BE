const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

router.get("/:userId/keyword", studyRoomCtl.keywordSearch);
router.get("/:userId/recommend", studyRoomCtl.catRecommend);
router.get("/allRoom", studyRoomCtl.allRoomList);

module.exports = router;
