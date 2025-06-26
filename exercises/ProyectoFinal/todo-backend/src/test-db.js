require('dotenv').config();
const db = require('./config/db');

(async () => {
  try {
    // Lista tablas existentes
    const res = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public';
    `);
    console.log('Tablas en la BD:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
