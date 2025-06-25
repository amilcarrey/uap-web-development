import { Request, Response, NextFunction } from "express";


export const requestLoggerMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const start = new Date();
  const timestamp = start.toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  res.on("finish", () => {
    const duration = Date.now() - start.getTime();
    
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${
        res.statusMessage
      } - ${duration}ms`
    );
  });
  
  next();
};