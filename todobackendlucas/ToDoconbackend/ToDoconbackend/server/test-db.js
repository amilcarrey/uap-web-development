// test-db.js
import pool from './db/db.js';

async function testDB() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión básica
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa:', result.rows[0]);
    
    // Verificar estructura de tableros
    const tableros = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tableros'
      ORDER BY ordinal_position
    `);
    console.log(' Columnas de la tabla tableros:');
    tableros.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Verificar estructura de permisos
    const permisos = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'permisos'
      ORDER BY ordinal_position
    `);
    console.log(' Columnas de la tabla permisos:');
    permisos.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Probar consulta de tableros
    console.log(' Probando consulta de tableros para usuario 9...');
    const tablerosUsuario = await pool.query(`
      SELECT DISTINCT t.* 
      FROM tableros t
      INNER JOIN permisos p ON t.id = p.tablero_id
      WHERE p.usuario_id = $1
      ORDER BY t.id DESC
    `, [9]);
    console.log(' Tableros encontrados:', tablerosUsuario.rows.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDB();
