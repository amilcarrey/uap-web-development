'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Sequelize CLI usará esta propiedad para no encapsular todo en una transacción
  useTransaction: false,

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'Users',
        schema: 'public'
      },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: 'Users',
      schema: 'public'
    });
  }
};
