const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// name check
async function nameCheck(req, res) {
  try {
    const { username } = req.body;
    const nameCheck = await User.findOne({
      where: {
        [Op.or]: [{ username }],
      },
    });
    console.log(nameCheck);
    if (!nameCheck) {
      return res.status(200).send({
        result: "true",
      });
    } else {
      return res.status(400).send({
        result: "false",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}
// nick check
async function nickCheck(req, res) {
  try {
    const { nick } = req.body;
    const nickCheck = await User.findOne({
      where: {
        [Op.or]: [{ nick }],
      },
    });
    if (!nickCheck) {
      return res.status(200).send({
        result: "true",
      });
    } else {
      return res.status(400).send({
        result: "false",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}
// sign-up
async function createUser(req, res) {
  try {
    const { username, password, passwordConfirm, nick, category } = req.body;

    // 공백 확인
    if (
      username === "" ||
      password === "" ||
      passwordConfirm === "" ||
      nick === "" ||
      category === ""
    ) {
      return res.status(412).send({
        msg: "빠짐 없이 입력해주세요.",
      });
    }

    // 암호화 추가하기

    const pwForm = /^[a-zA-Z0-9]{6,12}$/;
    if (pwForm.test(password) !== true) {
      return res.status(400).send({
        msg: "패스워드 양식에 맞춰 작성바랍니다.",
      });
    }

    // 패스워드 불일치(입력, 재입력 칸)
    if (password !== passwordConfirm) {
      return res.status(400).send({
        msg: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
    }

    //비밀번호 비교 후 저장
    const hashedPass = bcrypt.hashSync(password, 5);
    await User.create({ username, nick, password: hashedPass, category });
    return res.status(201).send({
      msg: "가입 성공",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// login
async function login(req, res) {
  try {
    console.log("2");
    const { username, password } = req.body;
    const user = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { username, password },
    });
    // 공백 확인
    if (username === "" || password === "") {
      return res.status(412).send({
        msg: "빠짐 없이 입력해주세요.",
      });
    }
    //암호화 비교
    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      res.status(400).send({
        msg: "이메일 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }

    // user 정보 불일치
    if (!user) {
      return res.status(400).send({
        msg: "이메일 또는 패스워드가 잘못됐습니다.",
      });
    }
    // user 정보 일치
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
    return res.send({
      token,
    });
    console.log(token);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

module.exports = {
  nameCheck,
  nickCheck,
  createUser,
  login,
};
