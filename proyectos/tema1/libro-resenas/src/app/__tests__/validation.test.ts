import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const registroSchema = z.object({
  mail: z.string().email(),
  contrasena: z.string().min(6)
});

describe('Validación de datos de registro', () => {
  it('debe aceptar datos válidos', () => {
    const result = registroSchema.safeParse({ mail: 'test@correo.com', contrasena: 'abcdef' });
    expect(result.success).toBe(true);
  });

  it('debe rechazar email inválido', () => {
    const result = registroSchema.safeParse({ mail: 'noemail', contrasena: 'abcdef' });
    expect(result.success).toBe(false);
  });

  it('debe rechazar contraseña corta', () => {
    const result = registroSchema.safeParse({ mail: 'test@correo.com', contrasena: 'abc' });
    expect(result.success).toBe(false);
  });
});
