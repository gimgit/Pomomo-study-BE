const authRouter = require("./auth");
const userRouter = require("./user");
const post = require("./post");
const studyRoomRouter = require("./studyRoom");
const commentRouter = require("./comment");
const studyRouter = require("./studyTimer");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts/:postId/comments", commentRouter);
router.use("/posts", post);
router.use("/studyRoom", studyRoomRouter);
router.use("/study", studyRouter);

module.exports = router;
