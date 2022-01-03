const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

// router.get("/list/:roomPurpose", studyRoomCtl.keywordList);
router.get("/:userId/list/recommend", studyRoomCtl.recommendList);
//recommend는 유저 카테고리에 따라 스터디룸 추천중, 친구기능 완성되면 친구 접속한 방으로 바꿀 예정
router.get("/list/all", studyRoomCtl.allRoomList);
router.post("/:userId/hostRoom", studyRoomCtl.createRoom);
router.post("/:userId/enterRoom/:roomId", studyRoomCtl.enterRoom);
router.get("/:userId/enterRoom/:roomId", studyRoomCtl.reconnectRoom);
router.delete("/:userId/exitRoom/:roomId", studyRoomCtl.exitRoom);

module.exports = router;
