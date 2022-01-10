const { Post, User, Comment } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// get Comment
async function getComments(req, res) {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
    });
    return res.status(201).json({ comments });
  } catch (err) {
    return res.status(400).send({ msg: "댓글 조회 실패" });
  }
}

// post Comment
// 작성자 프로필이미지 처리해야됨
async function postComment(req, res) {
  const { nick, userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;
  try {
    await Comment.create({ nick, postId, comment, userId });
    return res.status(201).send({
      msg: "댓글 작성 성공",
    });
  } catch (err) {
    return res.status(400).send({ msg: "댓글 작성 실패" });
  }
}

//delete Comment
async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    // const nick = res.locals.user.nick;
    await Comment.destroy({ where: { postId, commentId } });
    return res.status(201).send({
      msg: "댓글 삭제 완료",
    });
  } catch (err) {
    return res.status(400).send({ msg: "댓글 삭제 실패" });
  }
}

module.exports = { getComments, postComment, deleteComment };
