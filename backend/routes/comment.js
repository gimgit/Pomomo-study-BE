const express = require("express");
const router = require("express").Router();
const commentCtl = require("../controller/comment");
const authorization = require("../middlewares/auth-middlewares.js");

router.get("/", commentCtl.getCommet);
router.post("/", authorization, commentCtl.postComment);
router.delete("/:commentId", authorization, commentCtl.deleteComment);

module.exports = router;
