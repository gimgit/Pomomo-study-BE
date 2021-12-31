const { Post, StudyTime } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");

//post posts
async function postBoard(req, res) {
  try {
    const { username } = res.locals.user;
    const { postContent, studyTime, postImg } = req.body;
    console.log(postContent);
    await User.create({ username, postContent, studyTime, postImg });
    return res.status(201).send();
  } catch (err) {
    return res.status(400).send(console.log(err));
  }
}

module.exports = {
  postBoard,
};
