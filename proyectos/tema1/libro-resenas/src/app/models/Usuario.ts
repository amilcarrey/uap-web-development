import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
});

export const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);