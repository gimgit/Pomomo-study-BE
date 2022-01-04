const { Post, User, StudyTime, Comment } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//get studyTime
//댓글 수 같이 불러오기 추가예정
async function getstudyTime(req, res) {
  try {
    const userId = res.locals.user.userId;
    const studyTime = await StudyTime.findOne({
      where: { userId },
      attributes: ["StudyTime"],
    });
    return res.status(201).json({ studyTime });
  } catch (err) {
    return res.status(400).send({ msg: "조회 실패" });
  }
}

// 이미지 업로드 확인용 함수
async function imgUpload(req, res) {
  try {
    const imgInfo = req.file;
    console.log(imgInfo);
    res.send("성공");
  } catch (err) {
    res.send(err);
  }
}

//post posts
async function postBoard(req, res) {
  try {
    const nick = res.locals.user.nick;
    const userId = res.locals.user.userId;
    const { bgtype, postContent, studyTime } = req.body;
    if (!req.file && bgtype) {
      const postImg = bgtype;

      await Post.create({ nick, postContent, studyTime, postImg, userId });
    } else {
      const postImg = req.file.location;
      console.log(req.file.location);

      await Post.create({ nick, postContent, studyTime, postImg, userId });
    }
    return res.status(201).send({
      msg: "저장",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: "작성 실패" });
  }
}

//get Board
async function getBoard(req, res) {
  try {
    const board = await Post.findAll({});
    return res.status(201).json({ board });
  } catch (err) {
    return res.status(400).send({ msg: "조회 실패" });
  }
}

//getDetail
async function getDetail(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({
      where: { postId },
    });
    return res.status(201).json({ post });
  } catch (err) {
    return res.status(400).send({ msg: "조회에 실패" });
  }
}

//deleteDetail //본인만 삭제가능하도록
async function deleteDetail(req, res) {
  try {
    const { postId } = req.params;
    console.log(postId);
    // const nick = res.locals.user.nick;
    await Post.destroy({ where: { postId: postId } });
    return res.status(201).send({
      msg: "게시판삭제 완료",
    });
  } catch (err) {
    return res.status(400).send({ msg: "게시판삭제 실패" });
  }
}

module.exports = {
  postBoard,
  getstudyTime,
  getBoard,
  getDetail,
  deleteDetail,
  imgUpload,
};
