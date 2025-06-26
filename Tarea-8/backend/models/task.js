// backend/models/task.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Una tarea pertenece a un tablero
      Task.belongsTo(models.Board, {
        foreignKey: 'boardId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'board' // Añadimos 'as' para que el include en el controlador funcione bien
      });
      // Una tarea pertenece a un usuario
      Task.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'user' // Añadimos 'as' para que el include en el controlador funcione bien
      });
    }
  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('to-do', 'in-progress', 'done'), // <-- ¡CORREGIDO AQUÍ!
      defaultValue: 'to-do', // Valor por defecto consistente
      allowNull: false
    },
    dueDate: DataTypes.DATE, // Puedes mantenerlo si lo vas a usar, o eliminarlo si no.
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'Tasks', // ¡Es buena práctica definir el nombre de la tabla!
    timestamps: true // Asegúrate de que esto esté implícito o explícito si quieres createdAt/updatedAt
  });
  return Task;
};