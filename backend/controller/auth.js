const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// sign-up
async function CreateUser(req, res) {
  try {
    const { email, password, passwordConfirm, nick } = req.body;

    // 공백 확인
    if (
      email === "" ||
      password === "" ||
      passwordConfirm === "" ||
      nick === ""
    ) {
      return res.status(412).send({
        msg: "빠짐 없이 입력해주세요.",
      });
    }

    // 이메일 양식 확인
    const emailForm =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (emailForm.test(email) !== true) {
      return res.status(400).send({
        msg: "이메일 형식으로 입력해주세요.",
      });
    }
    // 암호화 추가하기

    // 패스워드 양식 확인
    if (password.length < 6 == true) {
      return res.status(400).send({
        msg: "패스워드는 6자 이상으로 입력해주세요.",
      });
    }

    // 패스워드 불일치(입력, 재입력 칸)
    if (password !== passwordConfirm) {
      return res.status(400).send({
        msg: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
    }

    // 이미 동일 정보가 있을 경우
    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }],
      },
    });
    if (existUsers.length) {
      return res.status(400).send({
        msg: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
    }

    // 회원가입 정보를 db에 저장
    await User.create({ email, nick, password });
    return res.status(201).send({}); // post created 201 반환
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// login
async function Login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } }); // user 조회, findOne 사용 가능, 이메일과 패스워드가 둘 다 맞아야함

    // 공백 확인
    if (email === "" || password === "") {
      return res.status(412).send({
        msg: "빠짐 없이 입력해주세요.",
      });
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
  CreateUser,
  Login,
};
