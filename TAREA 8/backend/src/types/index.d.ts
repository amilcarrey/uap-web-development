import { Usuario, Rol } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        email: string;
      };
      rolUsuario?: Rol;
    }
  }
}

export interface UsuarioPayload {
  id: number;
  email: string;
}

export interface ErrorResponse {
  error: string;
}
