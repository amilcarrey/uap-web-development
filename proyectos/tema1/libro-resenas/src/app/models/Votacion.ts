import mongoose from 'mongoose';

const VotacionSchema = new mongoose.Schema({
  reseñaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resena', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, enum: ['like', 'dislike'], required: true },
  fecha: { type: Date, default: Date.now },
});

export const Votacion = mongoose.models.Votacion || mongoose.model('Votacion', VotacionSchema);
