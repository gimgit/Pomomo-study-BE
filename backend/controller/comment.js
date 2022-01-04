const { Post, User, Comment } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//post Comment
async function postComment(req, res) {
  const nick = res.locals.user.nick;
  const { postId } = req.params;
  const { comment } = req.body;
  console.log(postId);
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

module.exports = { postComment, deleteComment };
