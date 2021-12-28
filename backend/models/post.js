const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          primaryKey: true,
          unique: true,
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        postTittle: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        postContent: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        postImg: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'Posts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {
      foreignKey: 'userId',
      targetKey: 'userId',
      onDelete: 'CASCADE',
    })
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'postId' })
  }
}
