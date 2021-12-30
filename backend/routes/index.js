const authRouter = require("./auth");
const userRouter = require("./user");
const studyRoom = require("./studyRoom");
const study = require("./study");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roomList", studyRoom);
router.use("/study", study);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// Router.post("/study/:userId/recordTime", recordStudyTime);
