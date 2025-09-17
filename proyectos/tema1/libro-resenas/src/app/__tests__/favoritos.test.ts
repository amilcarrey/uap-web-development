import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Favorito } from '../models/Favorito';
import { Usuario } from '../models/Usuario';

let usuarioId: string;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-libro-resenas');
  const usuario = new Usuario({ mail: 'fav@correo.com', contrasena: 'hash' });
  await usuario.save();
  usuarioId = usuario._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('CRUD de favoritos', () => {
  let favId: string;
  it('debe agregar un libro a favoritos', async () => {
    const fav = new Favorito({ usuarioId, libroId: 'libroX' });
    await fav.save();
    expect(fav._id).toBeTruthy();
    favId = fav._id.toString();
  });

  it('debe leer el favorito', async () => {
    const fav = await Favorito.findById(favId);
    expect(fav).toBeTruthy();
    expect(fav.libroId).toBe('libroX');
  });

  it('debe eliminar el favorito', async () => {
    await Favorito.findByIdAndDelete(favId);
    const fav = await Favorito.findById(favId);
    expect(fav).toBeNull();
  });
});
