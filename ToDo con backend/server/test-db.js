import pool from "./db/db.js";

async function testDatabase() {
  try {
    console.log("🔍 Probando conexión a la base de datos...");

    // Probar conexión
    const client = await pool.connect();
    console.log("✅ Conexión exitosa a PostgreSQL");

    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("📋 Tablas encontradas:");
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    // Verificar estructura de la tabla tablero_usuarios
    const tableroUsuariosResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tablero_usuarios'
      ORDER BY ordinal_position;
    `);

    console.log("🏢 Estructura de tablero_usuarios:");
    tableroUsuariosResult.rows.forEach((row) => {
      console.log(
        `  - ${row.column_name}: ${row.data_type} (${
          row.is_nullable === "YES" ? "nullable" : "not null"
        })`
      );
    });

    // Verificar algunos datos de prueba
    const usuariosCount = await client.query("SELECT COUNT(*) FROM usuarios");
    const tablerosCount = await client.query("SELECT COUNT(*) FROM tableros");
    const tareasCount = await client.query("SELECT COUNT(*) FROM tareas");
    const permisosCount = await client.query(
      "SELECT COUNT(*) FROM tablero_usuarios"
    );

    console.log("📊 Estadísticas:");
    console.log(`  - Usuarios: ${usuariosCount.rows[0].count}`);
    console.log(`  - Tableros: ${tablerosCount.rows[0].count}`);
    console.log(`  - Tareas: ${tareasCount.rows[0].count}`);
    console.log(`  - Permisos: ${permisosCount.rows[0].count}`);

    // Verificar permisos específicos
    const permisosDetalle = await client.query(`
      SELECT tu.*, u.email as usuario_email, t.nombre as tablero_nombre
      FROM tablero_usuarios tu
      JOIN usuarios u ON tu.usuario_id = u.id
      JOIN tableros t ON tu.tablero_id = t.id
      ORDER BY tu.tablero_id, tu.usuario_id
    `);

    console.log("🔐 Permisos detallados:");
    permisosDetalle.rows.forEach((row) => {
      console.log(
        `  - Usuario "${row.usuario_email}" tiene rol "${row.rol}" en tablero "${row.tablero_nombre}"`
      );
    });

    client.release();
    console.log("✅ Prueba de base de datos completada");
  } catch (error) {
    console.error("❌ Error en la prueba de base de datos:", error);
  } finally {
    await pool.end();
  }
}

testDatabase();
