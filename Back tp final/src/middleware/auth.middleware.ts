

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { name: string; id: string };
    }
  }
}

export const authWithHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //console.log('Authorization header:', req.headers.authorization);
  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    //console.log('ERROR: No token found in authorization header');
    res.status(401).json({ error: "Unauthorizedddd" });
    return;
  }
  
  try {
    const user = jwt.verify(token, "secret") as { name: string; id: string };
    //console.log('Token decoded successfully:', user);
    req.user = user;
    next();
  } catch (error) {
    //console.log('ERROR: Token verification failed:', error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};

export const authWithCookiesMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
 // console.log('=== COOKIE AUTH MIDDLEWARE DEBUG ===');
  //console.log('Signed cookies:', req.signedCookies);
  
  const token = req.signedCookies?.token;
  if (!token) {
    console.log('ERROR: No token found in cookies');
    res.status(401).json({ error: "No token found in cookies" });
    return;
   
  }
     // console.log('No TOKEN LPMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM found in cookies');

  try {
    const user = jwt.verify(token, "secret") as { name: string; id: string };
    //console.log('Cookie token decoded successfully:', user);
    req.user = user;
    next();
  } catch (error) {
    console.log('ERROR: Cookie token verification failed:', error);
    res.status(401).json({ error: "Invalid token in cookies" });
    return;
  }
};
