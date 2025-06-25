const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Board = require('./Board');

const Task = sequelize.define('Task', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  boardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Relación: Un usuario tiene muchas tareas
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });
Board.hasMany(Task, { foreignKey: 'boardId' });
Task.belongsTo(Board, { foreignKey: 'boardId' });

module.exports = Task;