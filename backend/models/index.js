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
