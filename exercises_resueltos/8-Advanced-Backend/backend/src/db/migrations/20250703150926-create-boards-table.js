'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      owner_id: { // Column name in snake_case
        type: Sequelize.INTEGER,
        allowNull: true, // Can be null if owner is deleted and onDelete is SET NULL
        references: {
          model: 'users', // Name of the referenced table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Or 'CASCADE' if boards should be deleted with owner
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('boards');
  }
};
