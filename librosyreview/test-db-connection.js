// Script de prueba para verificar la conexión a MongoDB Atlas
// IMPORTANTE: Cargar variables de entorno ANTES de cualquier otra importación
import { config } from 'dotenv';
import { resolve } from 'path';
// Cargar el archivo .env.local explícitamente ANTES de importar db.ts
config({ path: resolve(process.cwd(), '.env.local') });
// Verificar que las variables se cargaron correctamente
console.log('🔧 Cargando variables de entorno...');
console.log('📍 Directorio actual:', process.cwd());
console.log('📄 Archivo .env.local:', resolve(process.cwd(), '.env.local'));
console.log('🔑 MONGODB_URI cargada:', process.env.MONGODB_URI ? 'SÍ' : 'NO');
// Solo después de cargar las variables, importar las funciones de base de datos
import { connectToDatabase, disconnectFromDatabase, isConnected } from './app/lib/db.js';
/**
 * Función principal para probar la conexión a MongoDB
 * Verifica que la base de datos esté accesible y funcionando
 */
async function testDatabaseConnection() {
    try {
        console.log('\n🧪 Iniciando prueba de conexión a MongoDB Atlas...');
        console.log('📋 Variables de entorno verificadas:');
        console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Definida' : '❌ No definida');
        console.log('   - NODE_ENV:', process.env.NODE_ENV || 'No definida');
        console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definida' : '❌ No definida');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI no está definida después de cargar .env.local');
        }
        console.log('\n⏳ Intentando conectar a MongoDB Atlas...');
        // Intentar conectar a la base de datos
        await connectToDatabase();
        // Verificar el estado de la conexión
        if (isConnected()) {
            console.log('✅ ¡Conexión exitosa! MongoDB Atlas está funcionando correctamente');
            console.log('📊 Estado de la conexión: CONECTADO');
            // Información adicional sobre la conexión
            const mongoose = require('mongoose');
            console.log('🔗 Base de datos:', mongoose.connection.db?.databaseName || 'No disponible');
            console.log('🌐 Host:', mongoose.connection.host || 'No disponible');
            console.log('🔢 Puerto:', mongoose.connection.port || 'No disponible');
            console.log('📊 Estado de conexión:', mongoose.connection.readyState);
        }
        else {
            console.log('❌ Error: La conexión no se estableció correctamente');
        }
    }
    catch (error) {
        console.error('\n❌ Error durante la prueba de conexión:');
        console.error('📝 Detalles del error:', error);
        // Sugerencias de solución
        console.log('\n🔧 Posibles soluciones:');
        console.log('1. Verificar que .env.local existe en el directorio raíz');
        console.log('2. Comprobar que la IP esté en la whitelist de MongoDB Atlas');
        console.log('3. Verificar las credenciales de la base de datos');
        console.log('4. Comprobar la conectividad a internet');
        console.log('5. Verificar que el cluster esté activo en MongoDB Atlas');
    }
    finally {
        // Limpiar la conexión
        try {
            if (isConnected()) {
                await disconnectFromDatabase();
                console.log('\n🔌 Conexión cerrada correctamente');
            }
        }
        catch (disconnectError) {
            console.error('⚠️  Error al cerrar la conexión:', disconnectError);
        }
    }
}
// Ejecutar la prueba
if (require.main === module) {
    testDatabaseConnection()
        .then(() => {
        console.log('\n🎉 Prueba de conexión completada');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Error fatal en la prueba:', error);
        process.exit(1);
    });
}
export { testDatabaseConnection };
