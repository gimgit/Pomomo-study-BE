const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 사용하세요.",
      });
      return;
    }
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
    console.log(userId);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};
