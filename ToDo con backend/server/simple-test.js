import pool from './db/db.js';

async function simpleTest() {
  try {
    console.log('Probando conexión...');
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa:', result.rows[0]);
    
    // Verificar usuarios
    const users = await pool.query('SELECT id, email FROM usuarios LIMIT 5');
    console.log('Usuarios:', users.rows);
    
    // Verificar tableros
    const tableros = await pool.query('SELECT id, nombre FROM tableros LIMIT 5');
    console.log('Tableros:', tableros.rows);
    
    // Verificar permisos
    const permisos = await pool.query('SELECT * FROM tablero_usuarios LIMIT 10');
    console.log('Permisos:', permisos.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

simpleTest();
