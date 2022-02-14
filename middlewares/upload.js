const path = require("path");
const multerS3 = require("multer-s3");
const multer = require("multer");
const AWS = require("aws-sdk");
require("dotenv").config();

// AWS S3 사용하기 위한 config
AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.AWSRegion,
});

// multer를 사용하여 이미지를 업로드하는 미들웨어
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "lsh-s3-bucket",
    key(req, file, cb) {
      cb(null, `bbomomo/${+new Date()}${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
