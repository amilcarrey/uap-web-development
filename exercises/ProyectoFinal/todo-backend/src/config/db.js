const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,              
  port:     Number(process.env.DB_PORT),      
  user:     process.env.DB_USER,              
  password: process.env.DB_PASS,              
  database: process.env.DB_NAME,              
  max:      10,          
  idleTimeoutMillis: 30000, 
});

pool.on('connect', () => console.log('🔗 Conectado a Postgres'));
pool.on('error', err => console.error('Error en pool Postgres', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};