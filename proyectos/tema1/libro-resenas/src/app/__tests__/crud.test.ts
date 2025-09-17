import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Resena } from '../models/Resena';
import { Usuario } from '../models/Usuario';

let usuarioId: string;

import bcrypt from 'bcryptjs';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-libro-resenas');
  // Crear usuario para pruebas con contraseña hasheada
  const contrasena = 'crudpass';
  const hash = await bcrypt.hash(contrasena, 10);
  await Usuario.deleteMany({ mail: 'crud@correo.com' });
  const usuario = new Usuario({ mail: 'crud@correo.com', contrasena: hash });
  await usuario.save();
  usuarioId = usuario._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('CRUD de reseñas', () => {
  let resenaId: string;
  it('debe crear una reseña', async () => {
    const nuevaResena = new Resena({ libroId: 'libro1', usuarioId, texto: 'Muy bueno', rating: 5 });
    await nuevaResena.save();
    expect(nuevaResena._id).toBeTruthy();
    resenaId = nuevaResena._id.toString();
  });

  it('debe leer la reseña creada', async () => {
    const resena = await Resena.findById(resenaId);
    expect(resena).toBeTruthy();
    expect(resena.texto).toBe('Muy bueno');
  });

  it('debe actualizar la reseña', async () => {
    await Resena.findByIdAndUpdate(resenaId, { texto: 'Excelente', rating: 4 });
    const resena = await Resena.findById(resenaId);
    expect(resena.texto).toBe('Excelente');
    expect(resena.rating).toBe(4);
  });

  it('debe eliminar la reseña', async () => {
    await Resena.findByIdAndDelete(resenaId);
    const resena = await Resena.findById(resenaId);
    expect(resena).toBeNull();
  });
});
