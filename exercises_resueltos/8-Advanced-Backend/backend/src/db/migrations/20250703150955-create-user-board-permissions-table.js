'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_board_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: { // Column name in snake_case
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      board_id: { // Column name in snake_case
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission_level: { // Column name in snake_case
        type: Sequelize.ENUM('owner', 'editor', 'viewer'),
        allowNull: false,
        defaultValue: 'viewer'
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

    // Add a unique constraint for userId and boardId combination
    await queryInterface.addConstraint('user_board_permissions', {
      fields: ['user_id', 'board_id'],
      type: 'unique',
      name: 'user_board_permissions_unique_user_board'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_board_permissions', 'user_board_permissions_unique_user_board');
    await queryInterface.dropTable('user_board_permissions');
  }
};
