// knexfile.js
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  staging: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
