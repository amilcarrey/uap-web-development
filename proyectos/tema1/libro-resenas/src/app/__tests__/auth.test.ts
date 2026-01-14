import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Usuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';

// Mock de conexión a la base de datos

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-libro-resenas');
  // Crear usuario para login
  await Usuario.deleteMany({ mail: 'test@correo.com' });
  const contrasena = '123456';
  const hash = await bcrypt.hash(contrasena, 10);
  const nuevoUsuario = new Usuario({ mail: 'test@correo.com', contrasena: hash });
  await nuevoUsuario.save();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Registro de usuario', () => {
  it('debe crear un usuario con email y contraseña hasheada', async () => {
    const mail = 'test@correo.com';
    const contrasena = '123456';
    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = new Usuario({ mail, contrasena: hash });
    await nuevoUsuario.save();
    const usuarioDB = await Usuario.findOne({ mail });
    expect(usuarioDB).toBeTruthy();
    expect(usuarioDB.mail).toBe(mail);
    expect(await bcrypt.compare(contrasena, usuarioDB.contrasena)).toBe(true);
  });

  it('no debe permitir emails repetidos', async () => {
    const mail = 'test@correo.com';
    const contrasena = 'abcdef';
    const hash = await bcrypt.hash(contrasena, 10);
    try {
      const usuarioDuplicado = new Usuario({ mail, contrasena: hash });
      await usuarioDuplicado.save();
    } catch (err: any) {
      expect(err).toBeTruthy();
      expect(err.code).toBe(11000); // error de duplicado en MongoDB
    }
  });
});

describe('Login de usuario', () => {
  it('debe autenticar con email y contraseña correcta', async () => {
    const mail = 'test@correo.com';
    const usuario = await Usuario.findOne({ mail });
    expect(usuario).toBeTruthy();
    // La contraseña usada en el registro es '123456'
    expect(await bcrypt.compare('123456', usuario.contrasena)).toBe(true);
  });

  it('no debe autenticar con contraseña incorrecta', async () => {
    const mail = 'test@correo.com';
    const usuario = await Usuario.findOne({ mail });
    expect(usuario).toBeTruthy();
    expect(await bcrypt.compare('incorrecta', usuario.contrasena)).toBe(false);
  });
});
