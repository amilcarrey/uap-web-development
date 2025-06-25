'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('123456', 10);
    // Crea un usuario
    await queryInterface.bulkInsert('Users', [{
      username: 'usuario_demo',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Busca el id del usuario creado
    const users = await queryInterface.sequelize.query(
      `SELECT id from Users WHERE username = 'usuario_demo';`
    );
    const userId = users[0][0].id;

    // Crea un board para ese usuario
    await queryInterface.bulkInsert('Boards', [{
      name: 'Board Demo',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Boards', null, {});
    await queryInterface.bulkDelete('Users', { username: 'usuario_demo' }, {});
  }
};
