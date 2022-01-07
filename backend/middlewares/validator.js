const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ msg: "validate error" });
};

const validateName = [body("username").isLength({ min: 3 }), validate];
const validateNick = [body("nick").isLength({ min: 3 }), validate];
const validatePass = [
  body("password")
    .isLength({ min: 6 })
    .matches(/^[a-zA-Z0-9]{6,12}$/),
  validate,
];

module.exports = { validateName, validateNick, validatePass };
