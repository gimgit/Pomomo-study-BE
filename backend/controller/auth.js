const { User } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

// name check
async function nameCheck(req, res) {
  try {
    const { username } = req.body;
    const existUser = await User.findOne({
      where: { username },
    });
    if (!existUser) {
      return res.status(200).send({
        result: "true",
        msg: "사용가능 한 아이디입니다.",
      });
    } else {
      return res.status(200).send({
        result: "false",
        msg: "이미 사용중인 아이디입니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// nick check
async function nickCheck(req, res) {
  try {
    const { nick } = req.body;
    const existUser = await User.findOne({
      where: { nick },
    });
    if (!existUser) {
      return res.status(200).send({
        result: "true",
        msg: "사용가능 한 닉네임입니다.",
      });
    } else {
      return res.status(200).send({
        result: "false",
        msg: "이미 사용중인 닉네임입니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
// sign-up
async function createUser(req, res) {
  try {
    const { username, password, passwordConfirm, nick, category } = req.body;
    //비밀번호 비교 후 저장
    const hashedPass = bcrypt.hashSync(password, +process.env.SECRET_SALT);
    
    await User.create({ username, nick, password: hashedPass, category });
    return res.status(201).send({
      msg: "회원가입 성공",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "회원가입 실패",
    });
  }
}

// login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
    });

    // user 정보 불일치
    if (!user) {
      return res.status(400).send({
        msg: "아이디 혹은 비밀번호를 확인해주세요.",
      });
    }

    // 암호화 비교
    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      return res.status(400).send({
        msg: "아이디 혹은 비밀번호를 확인해주세요. ",
      });
    }

    // user 정보 일치
    const token = jwt.sign(
      { userId: user.userId, nick: user.nick },
      process.env.SECRET_KEY
    );
    return res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "login함수에서 발생하는 에러",
    });
  }
}

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      const { userId, nick } = user;
      console.log(user);
      const token = jwt.sign({ userId, nick }, process.env.SECRET_KEY);
      result = {
        token,
        nick,
      };
      res.send({ user: result });
    }
  )(req, res, next);
};

module.exports = {
  nameCheck,
  nickCheck,
  createUser,
  login,
  kakaoCallback,
};
