const express = require("express");
const router = require("express").Router();
const commentCtl = require("../controller/comment");
const authorization = require("../middlewares/auth-middlewares.js");

router.post("/:postId/comments", authorization, commentCtl.postComment);
router.delete(
  "/:postId/comments/:commentId",
  authorization,
  commentCtl.deleteComment
);

module.exports = router;
