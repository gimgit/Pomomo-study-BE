const Sequelize = require('sequelize')
const User = require('./user')
const StudyTime = require('./studytime')
const PersonInRoom = require('./personInRoom')
const Room = require('./room')
const Comment = require('./comment')
const Post = require('./post')
const ChatRoom = require('./chatRoom')
const Chat = require('./chat')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]
const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)
db.sequelize = sequelize

db.User = User
db.StudyTime = StudyTime
db.PersonInRoom = PersonInRoom
db.Room = Room
db.Comment = Comment
db.Post = Post
db.ChatRoom = ChatRoom
db.Chat = Chat

User.init(sequelize)
StudyTime.init(sequelize)
PersonInRoom.init(sequelize)
Room.init(sequelize)
Comment.init(sequelize)
Post.init(sequelize)
ChatRoom.init(sequelize)
Chat.init(sequelize)

User.associate(db)
StudyTime.associate(db)
PersonInRoom.associate(db)
Room.associate(db)
Comment.associate(db)
Post.associate(db)
ChatRoom.associate(db)
Chat.associate(db)

module.exports = db

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const User = require('./user')
// const StudyTime = require('./studytime')
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.User = User;
// db.studyTime = StudyTime;

// User.init(sequelize);
// StudyTime.init(sequelize);

// User.associate(db);
// StudyTime.associate(db);

// module.exports = db;
