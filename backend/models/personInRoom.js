const Sequelize = require('sequelize')

module.exports = class PersonInRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'PersonInRoom',
        tableName: 'PersonInRooms',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PersonInRoom.belongsTo(db.User, {
      foreignKey: 'userId',
      targetKey: 'userId',
    })
    db.PersonInRoom.belongsTo(db.Room, {
      foreignKey: 'roomId',
      targetKey: 'roomId',
    })
  }
}
