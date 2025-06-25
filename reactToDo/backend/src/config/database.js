const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // El archivo donde se guardan los datos
  logging: false,
});

module.exports = sequelize;