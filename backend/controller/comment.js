const { Post, User, Comment } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//get Comment
async function getCommet(req, res) {
  const { postId } = req.params;
  console.log(req.params);
  try {
    const comment = await Comment.findAll({
      where: { postId },
      order: [["postId", "DESC"]],
    });
    console.log(comment);
    return res.status(201).json({ comment });
  } catch (err) {
    return res.status(400).send({ msg: "조회 실패" });
  }
}

//post Comment
async function postComment(req, res) {
  const nick = res.locals.user.nick;
  const { postId } = req.params;
  console.log(req.params);
  const { comment } = req.body;
  try {
    await Comment.create({ nick, postId, comment });
    return res.status(201).send({
      msg: "댓글작성 성공",
    });
  } catch (err) {
    return res.status(400).send({ msg: "댓글작성 실패" });
  }
}

//delete Comment
async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    console.log(commentId);
    // const nick = res.locals.user.nick;
    await Post.destroy;
    ({ where: { postId, commentId } });
    return res.status(201).send({
      msg: "삭제 완료",
    });
  } catch (err) {
    return res.status(400).send({ msg: "삭제 실패" });
  }
}

//delete comment

module.exports = { getCommet, postComment, deleteComment };
