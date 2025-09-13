'use strict';

/** @type {import('sequelize-cli').Migration} */
module.js = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_settings', {
      user_id: { // Column name in snake_case
        type: Sequelize.INTEGER,
        primaryKey: true, // This is the PK
        allowNull: false,
        references: {
          model: 'users', // Name of the referenced table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // User settings are deleted if the user is deleted
      },
      auto_update_interval: { // Column name in snake_case
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 300 // Example: 5 minutes (300 seconds)
      },
      task_visualization_prefs: { // Column name in snake_case
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
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
    await queryInterface.dropTable('user_settings');
  }
};
