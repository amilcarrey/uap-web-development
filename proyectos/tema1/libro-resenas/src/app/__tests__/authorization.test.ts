import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecret';

describe('Casos de autorización', () => {
  it('permite acceso con token válido', () => {
    const token = jwt.sign({ id: 'abc', mail: 'user@correo.com' }, JWT_SECRET, { expiresIn: '1h' });
    const payload = jwt.verify(token, JWT_SECRET);
    expect(payload).toHaveProperty('id', 'abc');
    expect(payload).toHaveProperty('mail', 'user@correo.com');
  });

  it('deniega acceso con token inválido', () => {
    try {
      jwt.verify('token-falso', JWT_SECRET);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('deniega acceso si el token expiró', () => {
    const token = jwt.sign({ id: 'abc', mail: 'user@correo.com' }, JWT_SECRET, { expiresIn: '-1h' });
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
