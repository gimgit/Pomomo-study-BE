const authRouter = require("./auth");
const userRouter = require("./user");
const studyRoom = require("./studyRoom");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roomList", studyRoom);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// Router.post("/study/:userId/recordTime", recordStudyTime);
