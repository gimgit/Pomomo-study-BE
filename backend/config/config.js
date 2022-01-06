module.exports = {
  development: {
    username: "admin",
    password: process.env.MYSQL_PW,
    database: "pomomoDB",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      // timezone: "+09:00",
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
      // useUTC: false,
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
