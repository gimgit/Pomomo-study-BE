const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

const authorization = require("../middlewares/auth-middlewares");

router.get("/list/all", studyRoomCtl.allRoomList);
router.get("/list/keyword/:roomPurpose", studyRoomCtl.keywordList);
router.get("/:userId/list/recommend", studyRoomCtl.recommendList);
//recommend는 유저 카테고리에 따라 스터디룸 추천중, 친구기능 완성되면 친구 접속한 방으로 바꿀 예정
router.post("/hostRoom", authorization, studyRoomCtl.createRoom);
router.post("/enterRoom/:roomId", authorization, studyRoomCtl.enterRoom);
// router.post("/:userId/enterPrivateRoom/:roomId", studyRoomCtl.enterPrivateRoom);
// router.get("/:userId/enterRoom/:roomId", studyRoomCtl.reconnectRoom);
router.delete("/exitRoom/:roomId", authorization, studyRoomCtl.exitRoom);

module.exports = router;
