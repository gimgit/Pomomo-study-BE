const { Post, User, StudyTime, Comment, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

//비속어필터

// post posts
async function postArticle(req, res) {
  try {
    const { nick, userId } = res.locals.user;
    const { bgtype, postContent, studyTime } = req.body;
    if (!req.file) {
      // file이 아니고 bgtype 일 때
      const postImg = bgtype;
      await Post.create({ postContent, studyTime, postImg, userId });
    } else {
      // file 일 때
      const postImg = req.file.location;
      await Post.create({ postContent, studyTime, postImg, userId });
    }
    return res.status(201).send({
      msg: "게시글 작성 성공",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: "게시글 작성 실패" });
  }
}

// get Board
async function getBoard(req, res) {
  try {
    const board = await Post.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["nick"],
        },
        {
          model: Comment,
          as: "Comments",
          attributes: ["commentId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(201).json({ board });
  } catch (err) {
    return res.status(400).send({ msg: "게시글 조회 실패" });
  }
}

// getDetail
async function getArticle(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({
      where: { postId },
      include: [
        {
          model: Comment,
          as: "Comments",
          attributes: ["comment", "createdAt", "commentId"],
          raw: true,
          include: [
            {
              model: User,
              as: "User",
              attributes: ["nick", "profileImg"],
            },
          ],
        },
        {
          model: User,
          as: "User",
          attributes: ["nick", "profileImg"],
          raw: true,
        },
      ],
      order: [[{ model: Comment, as: "Comments" }, "createdAt", "DESC"]],
    });
    return res.status(201).send({ post });
  } catch (err) {
    return res.status(400).send({ msg: "상세페이지 조회 실패" });
  }
}

// deletePost
async function deleteArticle(req, res) {
  try {
    const { postId } = req.params;
    await Post.destroy({ where: { postId } });
    return res.status(201).send({
      msg: "게시판 삭제 완료",
    });
  } catch (err) {
    return res.status(400).send({ msg: "게시판 삭제 실패" });
  }
}

module.exports = {
  postArticle,
  getBoard,
  getArticle,
  deleteArticle,
};
