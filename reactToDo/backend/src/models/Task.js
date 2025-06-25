const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: DataTypes.STRING,
  boardId: DataTypes.STRING,
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Task;