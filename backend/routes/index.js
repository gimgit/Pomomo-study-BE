const authRouter = require("./auth");
const userRouter = require("./user");
const studyRoomRouter = require("./studyRoom");
const studyRouter = require("./studyTimer");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/studyRoom", studyRoomRouter);
router.use("/studyTimer", studyRouter);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// Router.post("/study/:userId/recordTime", recordStudyTime);
