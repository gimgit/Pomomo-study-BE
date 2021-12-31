const { Post, User, StudyTime } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");

//post posts
async function postBoard(req, res) {
  const username = res.locals.user;
  console.log(res.locals);
  const { postContent, studyTime, postImg } = req.body;
  console.log(postContent);
  try {
    await Post.create({ username, postContent, studyTime, postImg });
    return res.status(201).send(ok);
  } catch (err) {
    return res.status(400).send(console.log(err));
  }
}

module.exports = {
  postBoard,
};
