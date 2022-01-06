const Sequelize = require("sequelize");

module.exports = class StudyTime extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        purpose: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        studyTime: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "StudyTime",
        tableName: "StudyTimes",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.StudyTime.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
    });
  }
};
