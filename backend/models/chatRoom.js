const Sequelize = require('sequelize')

module.exports = class ChatRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        chatRoomId: {
          primaryKey: true,
          unique: true,
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        userId2: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChatRoom',
        tableName: 'ChatRooms',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.ChatRoom.belongsTo(db.User, {
      foreignKey: 'roomId',
      sourceKey: 'roomId',
    })
  }
}
