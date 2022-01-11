const express = require("express");
const router = require("express").Router();
const postCtl = require("../controller/post");
const authorization = require("../middlewares/auth-middlewares.js");
const upload = require("../middlewares/upload");

router.post("/", authorization, upload.single("file"), postCtl.postBoard);
router.get("/", postCtl.getBoard);
router.get("/:postId", postCtl.getDetail);
// router.delete("/:postId", postCtl.deleteDetail);

module.exports = router;
