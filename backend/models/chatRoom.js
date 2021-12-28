const Sequelize = require('sequelize')

module.exports = class ChatRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        chatRoomId: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        userId2: {
          type: Sequelize.INTEGER,
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
      foreignKey: 'userId',
      sourceKey: 'userId',
      onDelete: 'CASCADE',
      unique: false,
    })
  }
}
