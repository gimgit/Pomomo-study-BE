require("dotenv").config();

module.exports = {
  development: {
    username: "admin",
    password: process.env.MYSQL_PW,
    database: "pomomoDB",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    timezone: "+09:00", // DB에 저장할 때 시간 설정
    dialectOptions: {
      timezone: "+09:00", // DB에서 가져올 때 시간 설정
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
