// src/config/dbConfig.ts
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    database: process.env.DB_NAME,
    encrypt: false,
    trustServerCertificate: true,
    port: Number(process.env.DB_PORT) || 1433,
  },
};

export default dbConfig;

export const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log(' SQL Server conectado correctamente');
    return pool;
  })
  .catch(err => {
    console.error(' Error al conectar con SQL Server:', err);
    throw err;
  });