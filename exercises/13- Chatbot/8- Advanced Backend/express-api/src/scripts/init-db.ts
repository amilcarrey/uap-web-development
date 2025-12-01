import fs from 'fs';
import path from 'path';
import { Database } from '../db/connection';

const initializeDatabase = async () => {
    try {
        console.log('🗃️  Inicializando base de datos desde cero...');
        
        // Eliminar base de datos existente si existe
        const dbPath = path.join(__dirname, '../../database.sqlite');
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('✅ Base de datos existente eliminada');
        }
        
        // Crear nueva instancia de base de datos
        const db = Database.getInstance();
        
        // Esperar a que se inicialice
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Base de datos inicializada correctamente');
        console.log('📊 Datos de prueba creados:');
        console.log('   - Usuario: demo / Contraseña: demo123');
        console.log('   - Email: demo@example.com');
        console.log('   - Tablero demo con 3 TODOs');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        process.exit(1);
    }
};

initializeDatabase();
