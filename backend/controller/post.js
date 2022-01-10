const { Post, User, StudyTime, Comment } = require("../models");
const Sequelize = require("sequelize");
const { sequelize } = require("../models/user");
const { Op } = Sequelize;

// post posts
async function postBoard(req, res) {
  try {
    const { nick, userId } = res.locals.user;
    const { bgtype, postContent, studyTime } = req.body;
    if (!req.file) {
      // file이 아니고 bgtype 일 때
      const postImg = bgtype;
      await Post.create({ nick, postContent, studyTime, postImg, userId });
    } else {
      // file 일 때
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

// get Board
async function getBoard(req, res) {
  try {
    const board = await Post.findAll({
      attributes: {
        include: {
          model: Comment,
          as: "Comments",
          distinct: true,
          col: "postId",
          attributes: {
            attributes: [
              [sequelize.fn("sum", sequelize.col("studyTime")), "today"],
            ],
          },
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(201).json({ board });
  } catch (err) {
    return res.status(400).send({ msg: "게시글 조회 실패" });
  }
}

// getDetail
async function getDetail(req, res) {
  try {
    const { postId } = req.params;
    console.log(postId);
    const post = await Post.findOne({
      where: { postId },
      include: {
        model: Comment,
        as: "Comments",
        attributes: ["nick", "comment", "createdAt"],
        raw: true,
      },
    });
    return res.status(201).json({ post });
  } catch (err) {
    return res.status(400).send({ msg: "상세페이지 조회 실패" });
  }
}

// deleteDetail //본인만 삭제가능하도록
// async function deleteDetail(req, res) {
//   try {
//     const { postId } = req.params;
//     const { nick } = res.locals.user;
//     await Post.destroy({ where: { postId: postId } });
//     if(!nick)
//     return res.status(201).send({
//       msg: "게시판삭제 완료",
//     });
//   } catch (err) {
//     return res.status(400).send({ msg: "게시판삭제 실패" });
//   }
// }

module.exports = {
  postBoard,
  getBoard,
  getDetail,
};
