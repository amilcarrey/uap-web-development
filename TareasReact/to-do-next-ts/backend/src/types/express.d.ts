// src/types/express.d.ts
import { Usuario } from '../models/usuario';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

export {};
