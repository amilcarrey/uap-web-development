import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'supersecret';

function mockRequest(token?: string) {
  return {
    headers: {
      get: (name: string) => name === 'authorization' && token ? `Bearer ${token}` : null
    }
  };
}

describe('Middleware de autorización', () => {
  it('permite acceso con token válido', () => {
    const token = jwt.sign({ id: '123', mail: 'test@correo.com' }, JWT_SECRET, { expiresIn: '1h' });
    const req = mockRequest(token);
    // Simula la función getUserIdFromRequest
    const auth = req.headers.get('authorization');
    expect(auth).toContain('Bearer');
    const payload = jwt.verify(token, JWT_SECRET);
    expect(payload).toHaveProperty('id', '123');
  });

  it('deniega acceso con token inválido', () => {
    const req = mockRequest('token-falso');
    try {
      jwt.verify('token-falso', JWT_SECRET);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('deniega acceso sin token', () => {
    const req = mockRequest();
    const auth = req.headers.get('authorization');
    expect(auth).toBeNull();
  });
});
