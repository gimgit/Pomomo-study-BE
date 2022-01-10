const express = require("express");
const router = require("express").Router();
const postCtl = require("../controller/post");
const commentCtl = require("../controller/comment");
const authorization = require("../middlewares/auth-middlewares.js");
const upload = require("../middlewares/upload");

router.post("/", authorization, upload.single("file"), postCtl.postArticle);
router.get("/", postCtl.getBoard);
router.get("/:postId", postCtl.getArticle);
router.delete("/:postId", postCtl.deleteArticle);

router.get("/:postId/comments", commentCtl.getComments);
router.post("/:postId/comments", authorization, commentCtl.postComment);
router.delete(
  "/:postId/comments/:commentId",
  authorization,
  commentCtl.deleteComment
);

module.exports = router;
