export {}; // Necesario para que TypeScript lo trate como un módulo

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
