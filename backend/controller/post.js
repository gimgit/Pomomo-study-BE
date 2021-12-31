const { Post, User, StudyTime } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");

//post posts
async function postBoard(req, res) {
  const nick = res.locals.user.nick;
  console.log(res.locals.user.nick);
  const { postContent, studyTime, postImg } = req.body;
  console.log(postContent);
  try {
    await Post.create({ nick, postContent, studyTime, postImg });
    return res.status(201).send({
      msg: "ok",
    });
  } catch (err) {
    return res.status(400).send(console.log(err));
  }
}

module.exports = {
  postBoard,
};
