import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export interface AuthedRequest extends Request {
  user: {
    userId: string;
  };
}
