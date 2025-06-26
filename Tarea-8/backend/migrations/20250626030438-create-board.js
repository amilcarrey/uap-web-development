'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      userId: { // Clave foránea para vincular con el usuario
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Define la referencia a la tabla Users
          model: 'Users', // Nombre de la tabla a la que hace referencia
          key: 'id',      // Columna de la tabla Users a la que hace referencia
        },
        onUpdate: 'CASCADE', // Si el ID del usuario cambia, actualiza aquí
        onDelete: 'CASCADE'  // Si el usuario es eliminado, elimina sus tableros
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
    await queryInterface.dropTable('Boards');
  }
};