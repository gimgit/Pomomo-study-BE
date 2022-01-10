const { Post, User, StudyTime, Comment } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

//post posts
async function postBoard(req, res) {
  try {
    const { nick, userId } = res.locals.user;
    const { bgtype, postContent, studyTime } = req.body;
    if (!req.file && bgtype) {
      // file이 아니고 bgtype일 때
      const postImg = bgtype;
      await Post.create({ nick, postContent, studyTime, postImg, userId });
    } else {
      // file 일때
      const postImg = req.file.location;
      await Post.create({ nick, postContent, studyTime, postImg, userId });
    }
    return res.status(201).send({
      msg: "게시글 작성 성공",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: "게시글 작성 실패" });
  }
}

//get Boards
async function getBoard(req, res) {
  try {
    const board = await Post.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(201).json({ board });
  } catch (err) {
    return res.status(400).send({ msg: "조회 실패" });
  }
}

//getDetail
async function getDetail(req, res) {
  try {
    const { postId } = req.params;
    console.log(postId);
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
  getBoard,
  getDetail,
  deleteDetail,
};
