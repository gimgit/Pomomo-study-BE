const { User, StudyTime, sequelize } = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

async function checkUserInfo(req, res) {
  let now = new Date(Date.now() + 32400000);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let startDate = now.getDate() - 1;
  let todayStart = `${year}-${month}-${startDate}T04:00:00.000Z`;
  let todayEnd = `${year}-${month}-${date}T04:00:00.000Z`;
  console.log(now);
  console.log(todayStart);
  console.log(todayEnd);

  const { userId } = req.params;

  try {
    const userInfo = await User.findAll({
      where: { userId: userId },
      attributes: { exclude: ["password"] },
    });
    const studyRecord = await StudyTime.findAll({
      where: { userId: userId },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "total"]],
    });
    const todayRecord = await StudyTime.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      attributes: [[sequelize.fn("sum", sequelize.col("studyTime")), "today"]],
    });
    res.status(200).json({
      user: userInfo,
      totalRecord: studyRecord,
      todayRecord: todayRecord,
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserInfo(req, res) {
  const { userId } = req.params;
  const { category, nick } = req.body;
  try {
    const existNick = await User.findOne({
      where: { nick: nick },
    });
    if (existNick)
      return res
        .status(400)
        .send({ errorMessage: "이미 사용중인 닉네임입니다." });
    const userInfo = await User.findOne({
      where: { userId: userId },
    });
    if (!userInfo) return res.status(400).send("err");

    await User.update(
      { category: category, nick: nick },
      { where: { userId: userId } }
    );
    res.status(201).send({ msg: "수정완료!" });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserStatus(req, res) {
  const { userId } = req.params;
  const { statusMsg } = req.body;
  try {
    const userInfo = await User.findOne({ where: { userId: userId } });
    if (!userInfo) return res.status(400).send("err");

    await User.update({ statusMsg: statusMsg }, { where: { userId: userId } });
    res.status(201).json({ msg: "수정완료!" });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function updateUserImg(req, res) {
  const { userId } = req.params;
  const { profileImg } = req.body;
  try {
    const userInfo = await User.findOne({ where: { userId: userId } });
    if (!userInfo) return res.status(400).send("err");

    await User.update(
      { profileImg: profileImg },
      { where: { userId: userId } }
    );
    res.status(201).json({ msg: "수정완료!" });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// sign-up
async function AddUser(req, res) {
  try {
    const { email, password, passwordConfirm, nick } = req.body;

    // 공백 확인
    if (
      email === "" ||
      password === "" ||
      passwordConfirm === "" ||
      nick === ""
    ) {
      res.status(412).send({
        errorMessage: "빠짐 없이 입력해주세요.",
      });
      return;
    }

    // 이메일 양식 확인
    const emailForm =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (emailForm.test(email) !== true) {
      res.status(400).send({
        errorMessage: "이메일 형식으로 입력해주세요.",
      });
      return;
    }
    // 암호화 추가하기

    // 패스워드 양식 확인
    if (password.length < 6 == true) {
      res.status(400).send({
        errorMessage: "패스워드는 6자 이상으로 입력해주세요.",
      });
      return;
    }

    // 패스워드 불일치(입력, 재입력 칸)
    if (password !== passwordConfirm) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }

    // 이미 동일 정보가 있을 경우
    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }],
      },
    });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }

    // 회원가입 정보를 db에 저장
    await User.create({ email, nick, password });
    res.status(201).send({}); // post created 201 반환
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
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
      res.status(412).send({
        errorMessage: "빠짐 없이 입력해주세요.",
      });
      return;
    }

    // user 정보 불일치
    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }
    // user 정보 일치
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
    res.send({
      token,
    });
    console.log(token);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

module.exports = {
  checkUserInfo,
  updateUserInfo,
  updateUserStatus,
  updateUserImg,
  AddUser,
  Login,
};
