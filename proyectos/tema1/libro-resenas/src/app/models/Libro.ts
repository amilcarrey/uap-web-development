import mongoose from 'mongoose';

const LibroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  resena: String,
});

export const Libro = mongoose.model('Libro', LibroSchema);