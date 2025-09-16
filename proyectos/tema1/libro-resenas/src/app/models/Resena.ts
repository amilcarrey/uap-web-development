import mongoose from 'mongoose';

const ResenaSchema = new mongoose.Schema({
  libroId: { type: String, required: true }, 
  usuario: { type: String, required: true }, 
  texto: { type: String, required: true },   
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  fecha: { type: Date, default: Date.now },  
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

export const Resena = mongoose.models.Resena || mongoose.model('Resena', ResenaSchema);
