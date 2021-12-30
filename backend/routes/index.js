const authRouter = require("./auth");
const userRouter = require("./user");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

module.exports = router;

// const { recordStudyTime } = require("../controller/study");

// const { recommendRoom, searchRoom } = require("../controller/studyRoom");

// Router.post("/study/:userId/recordTime", recordStudyTime);

// Router.get("/:userId/reccomend", recommendRoom);
// Router.get("/keyword", searchRoom);

// Router.use("/roomList")
