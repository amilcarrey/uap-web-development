// scripts/migrate.ts
import sql from 'mssql';
import dbConfig from '../src/db/dbconfig';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    const pool = await sql.connect(dbConfig);
    
    console.log('📖 Leyendo archivo de migración...');
    const migrationPath = path.join(process.cwd(), 'migrations', 'add_task_page_size_column.sql');
    const migrationScript = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('🚀 Ejecutando migración...');
    const result = await pool.request().query(migrationScript);
    
    console.log('✅ Migración ejecutada exitosamente!');
    console.log('Resultado:', result);
    
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();
