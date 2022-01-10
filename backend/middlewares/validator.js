const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ msg: errors.array()[0].msg });
};

const validateName = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("잘못된 아이디 형식입니다"),
  validate,
];
const validateNick = [
  body("nick")
    .trim()
    .isLength({ min: 3 })
    .withMessage("잘못된 닉네임 형식입니다"),
  validate,
];
const validatePass = [
  body("password")
    .matches(/^[a-zA-Z0-9]{6,12}$/)
    .withMessage("비밀번호 양식이 다릅니다."),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    return true;
  }),
  validate,
];

const validateRegister = [
  body("username").notEmpty().withMessage("공백없이 입력해주세요"),
  body("password").notEmpty().withMessage("공백없이 입력해주세요"),
  body("passwordConfirm").notEmpty().withMessage("공백없이 입력해주세요"),
  body("nick").notEmpty().withMessage("공백없이 입력해주세요"),
  body("category").notEmpty().withMessage("공백없이 입력해주세요"),
  validate,
];

module.exports = { validateName, validateNick, validatePass, validateRegister };
