require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log, // or false
  },
  test: {
    url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL, // Fallback for simplicity
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Adjust as per your DB provider's requirements
      },
    },
  },
};
