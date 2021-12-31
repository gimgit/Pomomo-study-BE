const authRouter = require("./auth");
const userRouter = require("./user");
const studyRoom = require("./studyRoom");
const study = require("./study");
const post = require("./post");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roomList", studyRoom);
router.use("/study", study);
router.use("/posts", post);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// Router.post("/study/:userId/recordTime", recordStudyTime);
