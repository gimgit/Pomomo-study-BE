const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
          primaryKey: true,
          unique: true,
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        nick: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Comment",
        tableName: "Comments",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    db.Comment.belongsTo(db.Post, {
      foreignKey: "postId",
      sourceKey: "postId",
    });
  }
};
