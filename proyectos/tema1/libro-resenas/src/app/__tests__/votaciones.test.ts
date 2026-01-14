import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Votacion } from '../models/Votacion';
import { Usuario } from '../models/Usuario';
import { Resena } from '../models/Resena';

let usuarioId: string;
let resenaId: string;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-libro-resenas');
  const usuario = new Usuario({ mail: 'voto@correo.com', contrasena: 'hash' });
  await usuario.save();
  usuarioId = usuario._id.toString();
  const resena = new Resena({ libroId: 'libroY', usuarioId, texto: 'Reseña para votar', rating: 3 });
  await resena.save();
  resenaId = resena._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('CRUD de votaciones', () => {
  let votoId: string;
  it('debe registrar un voto', async () => {
    const voto = new Votacion({ reseñaId: resenaId, usuarioId, tipo: 'like' });
    await voto.save();
    expect(voto._id).toBeTruthy();
    votoId = voto._id.toString();
  });

  it('debe leer el voto', async () => {
    const voto = await Votacion.findById(votoId);
    expect(voto).toBeTruthy();
    expect(voto.tipo).toBe('like');
  });

  it('debe eliminar el voto', async () => {
    await Votacion.findByIdAndDelete(votoId);
    const voto = await Votacion.findById(votoId);
    expect(voto).toBeNull();
  });
});
