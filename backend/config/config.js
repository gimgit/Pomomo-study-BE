require('dotenv').config()

module.exports = {
  development: {
    username: 'admin',
    password: process.env.MYSQL,
    database: 'pomomoDB',
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
}
