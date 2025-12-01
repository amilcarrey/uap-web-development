import fs from 'fs';
import path from 'path';
import { Database } from '../db/connection';

const migrateDatabase = async () => {
    try {
        console.log('🔄 Ejecutando migración de base de datos...');
        
        const db = Database.getInstance();
        
        // Agregar la columna todos_per_page si no existe
        try {
            await db.run(`
                ALTER TABLE user_settings 
                ADD COLUMN todos_per_page INTEGER DEFAULT 10
            `);
            console.log('✅ Columna todos_per_page agregada a user_settings');
        } catch (error) {
            console.log('ℹ️  Columna todos_per_page ya existe o no se pudo agregar');
        }
        
        // Actualizar registros existentes que no tengan el valor
        await db.run(`
            UPDATE user_settings 
            SET todos_per_page = 10, updated_at = datetime('now')
            WHERE todos_per_page IS NULL
        `);
        
        console.log('✅ Migración completada exitosamente');
        console.log('📊 Nueva configuración disponible:');
        console.log('   - todos_per_page: Cantidad de TODOs por página (defecto: 10)');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
};

migrateDatabase();
