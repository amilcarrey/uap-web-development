import pool from './db/db.js';
import jwt from 'jsonwebtoken';
import { SECRET } from './config.js';

async function debugPermissions() {
  try {
    console.log('🔍 Iniciando diagnóstico de permisos...\n');
    
    // 1. Verificar conexión a BD
    await pool.query('SELECT 1');
    console.log('✅ Conexión a base de datos OK\n');
    
    // 2. Listar usuarios
    const usuarios = await pool.query('SELECT id, email FROM usuarios');
    console.log('👥 Usuarios en la base de datos:');
    usuarios.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Email: ${user.email}`);
    });
    console.log();
    
    // 3. Listar tableros
    const tableros = await pool.query('SELECT id, nombre FROM tableros');
    console.log('📋 Tableros en la base de datos:');
    tableros.rows.forEach((tablero, index) => {
      console.log(`  ${index + 1}. ID: ${tablero.id}, Nombre: ${tablero.nombre}`);
    });
    console.log();
    
    // 4. Listar permisos
    const permisos = await pool.query(`
      SELECT tu.*, u.email, t.nombre as tablero_nombre 
      FROM tablero_usuarios tu
      LEFT JOIN usuarios u ON tu.usuario_id = u.id
      LEFT JOIN tableros t ON tu.tablero_id = t.id
    `);
    console.log('🔐 Permisos asignados:');
    if (permisos.rows.length === 0) {
      console.log('  ❌ NO HAY PERMISOS ASIGNADOS - Este es el problema principal!');
    } else {
      permisos.rows.forEach((permiso, index) => {
        console.log(`  ${index + 1}. Usuario: ${permiso.email || 'DESCONOCIDO'} (ID: ${permiso.usuario_id})`);
        console.log(`      Tablero: ${permiso.tablero_nombre || 'DESCONOCIDO'} (ID: ${permiso.tablero_id})`);
        console.log(`      Rol: ${permiso.rol}`);
        console.log();
      });
    }
    
    // 5. Si hay usuarios y tableros, crear permisos de prueba
    if (usuarios.rows.length > 0 && tableros.rows.length > 0 && permisos.rows.length === 0) {
      console.log('🔧 Creando permisos de prueba...');
      
      const usuario = usuarios.rows[0];
      const tablero = tableros.rows[0];
      
      await pool.query(`
        INSERT INTO tablero_usuarios (tablero_id, usuario_id, rol)
        VALUES ($1, $2, 'propietario')
        ON CONFLICT (tablero_id, usuario_id) DO UPDATE SET rol = 'propietario'
      `, [tablero.id, usuario.id]);
      
      console.log(`✅ Permiso creado: Usuario ${usuario.email} es propietario del tablero ${tablero.nombre}`);
    }
    
    // 6. Generar token de prueba
    if (usuarios.rows.length > 0) {
      const usuario = usuarios.rows[0];
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '1h' });
      console.log(`\n🔑 Token de prueba para ${usuario.email}:`);
      console.log(`Cookie: token=${token}`);
      console.log('\nPuedes usar este token en las cookies de tu navegador para probar la autenticación.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugPermissions();
