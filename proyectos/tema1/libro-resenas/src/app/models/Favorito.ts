import mongoose from 'mongoose';

const FavoritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  libroId: { type: String, required: true }, // Google Books ID
  fecha: { type: Date, default: Date.now },
});

export const Favorito = mongoose.models.Favorito || mongoose.model('Favorito', FavoritoSchema);
