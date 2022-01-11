const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

const authorization = require("../middlewares/auth-middlewares");

router.get("/list/all", studyRoomCtl.allRoomList);
router.get("/list/keyword/:roomPurpose", studyRoomCtl.keywordList);
router.post("/hostRoom", authorization, studyRoomCtl.createRoom);
router.post("/enterRoom/:roomId", authorization, studyRoomCtl.enterRoom);
router.delete("/exitRoom/:roomId", authorization, studyRoomCtl.exitRoom);

module.exports = router;
