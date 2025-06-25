const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Board = sequelize.define('Board', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

User.hasMany(Board, { foreignKey: 'userId' });
Board.belongsTo(User, { foreignKey: 'userId' });

module.exports = Board;