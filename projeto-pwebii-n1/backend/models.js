const { DataTypes } = require('sequelize');

module.exports = function initModels(sequelize) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false }
  }, { timestamps: true });

  const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  }, { timestamps: true });

  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  }, { timestamps: true });

  // Associações
  User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Comment.belongsTo(User, { foreignKey: 'userId' });

  return { User, Post, Comment };
};
