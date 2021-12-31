const jwt = require("jsonwebtoken");
const User = require("../models");
require("dotenv").config();

// 유저 인증에 실패하면 401 상태 코드를 반환한다.
module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");
    console.log(tokenValue);
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
      console.log(user);
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.",
    });
    return;
  }
};
