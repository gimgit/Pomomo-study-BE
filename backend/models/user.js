const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        nick: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        profileImg: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        statusMsg: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.StudyTime, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    db.User.hasOne(db.PersonInRoom, {
      foreignKey: "userId",
      sourceKey: "userId",
      onDelete: "CASCADE",
    });
    db.User.hasMany(db.Post, {
      foreignKey: "userId",
      sourceKey: "userId",
      onDelete: "CASCADE",
    });
    db.User.hasMany(db.Comment, {
      foreignKey: "userId",
      sourceKey: "userId",
      onDelete: "CASCADE",
    });
    db.User.hasMany(db.ChatRoom, {
      foreignKey: "userId",
      sourceKey: "userId",
      onDelete: "CASCADE",
    });
  }
};
