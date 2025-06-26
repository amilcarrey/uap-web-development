// backend/migrations/XXXXXX-create-task.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      status: { // Por ejemplo: 'todo', 'in-progress', 'done'
        type: Sequelize.STRING(50),
        defaultValue: 'todo', // Valor por defecto
        allowNull: false
      },
      dueDate: { // Fecha de vencimiento
        type: Sequelize.DATE
      },
      boardId: { // Clave foránea para vincular con el tablero
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Boards', // Nombre de la tabla a la que hace referencia
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: { // Clave foránea para vincular con el usuario (redundante pero útil para consultas directas)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  }
};