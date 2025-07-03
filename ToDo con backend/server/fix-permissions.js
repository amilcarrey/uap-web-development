// Script para arreglar tableros existentes que no tienen permisos
import pool from "./db/db.js";

async function arreglarPermisos() {
  console.log("🔧 Arreglando permisos de tableros existentes...");

  try {
    // Obtener todos los tableros que tienen propietario pero no tienen entrada en tablero_usuarios
    const result = await pool.query(`
      SELECT t.id, t.propietario_id 
      FROM tableros t 
      LEFT JOIN tablero_usuarios tu ON t.id = tu.tablero_id AND t.propietario_id = tu.usuario_id
      WHERE t.propietario_id IS NOT NULL AND tu.tablero_id IS NULL
    `);

    console.log(
      `Encontrados ${result.rows.length} tableros sin permisos configurados`
    );

    for (const tablero of result.rows) {
      await pool.query(
        "INSERT INTO tablero_usuarios (tablero_id, usuario_id, rol) VALUES ($1, $2, 'propietario')",
        [tablero.id, tablero.propietario_id]
      );
      console.log(`✅ Permisos configurados para tablero ${tablero.id}`);
    }

    // Verificar el resultado
    const verificacion = await pool.query(`
      SELECT COUNT(*) as total_tableros,
             COUNT(tu.tablero_id) as tableros_con_permisos
      FROM tableros t 
      LEFT JOIN tablero_usuarios tu ON t.id = tu.tablero_id
    `);

    console.log("📊 Resumen:");
    console.log(`   Total tableros: ${verificacion.rows[0].total_tableros}`);
    console.log(
      `   Con permisos: ${verificacion.rows[0].tableros_con_permisos}`
    );

    console.log("✅ Proceso completado");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

arreglarPermisos();
