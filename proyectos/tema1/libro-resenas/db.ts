import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/libro-resenas'; 

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};