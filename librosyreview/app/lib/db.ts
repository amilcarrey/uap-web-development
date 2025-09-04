import mongoose from 'mongoose';

/**
 * Configuración de conexión a MongoDB Atlas
 * Maneja la conexión singleton para evitar múltiples conexiones
 */

// Variable global para mantener la conexión en desarrollo
declare global {
  var mongoose: any;
}

// URI de conexión desde variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor define la variable de entorno MONGODB_URI en .env.local'
  );
}

/**
 * Configuración de opciones de conexión a MongoDB
 * Optimizada para producción y desarrollo
 */
const connectionOptions = {
  bufferCommands: false, // Deshabilita el buffering de comandos
  maxPoolSize: 10, // Máximo número de conexiones en el pool
  serverSelectionTimeoutMS: 5000, // Timeout para selección de servidor
  socketTimeoutMS: 45000, // Timeout para operaciones de socket
  family: 4, // Usar IPv4
};

/**
 * Función para conectar a MongoDB Atlas
 * Implementa patrón singleton para reutilizar conexiones
 * @returns Promise<typeof mongoose> - Instancia de mongoose conectada
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    // En desarrollo, usar variable global para mantener la conexión
    if (process.env.NODE_ENV === 'development') {
      if (!global.mongoose) {
        console.log('🔄 Conectando a MongoDB Atlas...');
        global.mongoose = await mongoose.connect(MONGODB_URI!, connectionOptions);
        console.log('✅ Conexión a MongoDB Atlas establecida');
      }
      return global.mongoose;
    }

    // En producción, crear nueva conexión si no existe
    if (mongoose.connection.readyState === 0) {
      console.log('🔄 Conectando a MongoDB Atlas (Producción)...');
      await mongoose.connect(MONGODB_URI!, connectionOptions);
      console.log('✅ Conexión a MongoDB Atlas establecida (Producción)');
    }

    return mongoose;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error);
    throw new Error(`Error de conexión a la base de datos: ${error}`);
  }
}

/**
 * Función para desconectar de MongoDB
 * Útil para pruebas y limpieza
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB Atlas');
    }
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error);
    throw error;
  }
}

/**
 * Función para verificar el estado de la conexión
 * @returns boolean - true si está conectado, false si no
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Event listeners para la conexión de MongoDB
 * Manejo de eventos de conexión, error y desconexión
 */
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB Atlas: Conexión establecida');
});

mongoose.connection.on('error', (error) => {
  console.error('🔴 MongoDB Atlas: Error de conexión:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB Atlas: Conexión perdida');
});

// Manejo graceful de cierre de la aplicación
process.on('SIGINT', async () => {
  try {
    await disconnectFromDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error durante el cierre:', error);
    process.exit(1);
  }
});