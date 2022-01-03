const authRouter = require("./auth");
const userRouter = require("./user");
const post = require("./post");
const studyRoomRouter = require("./studyRoom");
const studyRouter = require("./study");
const commentRouter = require("./comment");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", post);
router.use("/studyRoom", studyRoomRouter);
router.use("/study", studyRouter);
router.use("/posts", commentRouter);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// Router.post("/study/:userId/recordTime", recordStudyTime);
