import pool from './db/db.js';

async function checkTareas() {
  const tareas = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'tareas' 
    ORDER BY ordinal_position
  `);
  console.log('Columnas de la tabla tareas:');
  tareas.rows.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type}`);
  });
  process.exit(0);
}

checkTareas();
