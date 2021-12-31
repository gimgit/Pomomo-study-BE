const express = require("express");
const router = require("express").Router();
const studyRoomCtl = require("../controller/studyRoom");

router.get("/:userId/list/keyword", studyRoomCtl.keywordList);
router.get("/:userId/list/recommend", studyRoomCtl.recommendList);
//recommend는 유저 카테고리에 따라 스터디룸 추천중, 친구기능 완성되면 친구 접속한 방으로 바꿀 예정
router.get("/list/all", studyRoomCtl.allRoomList);
router.post("/:userId/createRoom", studyRoomCtl.createRoom);

module.exports = router;
