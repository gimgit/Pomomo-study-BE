const { User, StudyTime, sequelize } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

    // 이미 동일 정보가 있을 경우
    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ username }],
      },
    });
    if (existUsers.length) {
      return res.status(400).send({
        msg: "이미 가입된 아이디 또는 닉네임이 있습니다.",
      });
    }

    const existNick = await User.findAll({
      where: {
        [Op.or]: [{ nick }],
      },
    });
    if (existNick.length) {
      return res.status(400).send({
        msg: "이미 가입된 아이디 또는 닉네임이 있습니다.",
      });
    }
    const hashedPass = bcrypt.hashSync(password, 5);
    await User.create({ username, nick, password: hashedPass, category });
    return res.status(201).send(); // post created 201 반환
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
    const { username, password } = req.body;
    const user = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { username, password },
    }); // user 조회, findOne 사용 가능, 이메일과 패스워드가 둘 다 맞아야함
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

    const nick = user.nick;
    // user 정보 일치
    // const token = jwt.sign({ username: user.nick }, process.env.SECRET_KEY);
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
    return res.send({
      token,
      nick,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

module.exports = {
  createUser,
  login,
};
