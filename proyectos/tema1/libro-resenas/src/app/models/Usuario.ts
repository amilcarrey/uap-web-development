import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true }, // hash
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorito' }],
  historialResenas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resena' }],
  fechaRegistro: { type: Date, default: Date.now },
});

export const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);