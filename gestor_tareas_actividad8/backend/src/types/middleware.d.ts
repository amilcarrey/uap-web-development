import { Request, Response, NextFunction } from 'express';

export type MiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;