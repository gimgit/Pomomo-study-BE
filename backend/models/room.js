const Sequelize = require("sequelize");

module.exports = class Room extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        roomId: {
          primaryKey: true,
          unique: true,
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        roomTittle: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        private: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        roomPassword: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        purpose: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        round: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        studyTime: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        recessTime: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        openAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Room",
        tableName: "Rooms",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Room.hasMany(db.PersonInRoom, {
      as: "peopleInRoom",
      foreignKey: "roomId",
      sourceKey: "roomId",
    });
  }
};
