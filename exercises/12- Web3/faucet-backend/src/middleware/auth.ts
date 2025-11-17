import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  type { JWTPayload } from '../types';

declare global {
    namespace Express {
        interface Request {
        user?: JWTPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            message: 'Please provide a valid JWT token' 
        });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return res.status(500).json({ 
            error: 'Server configuration error',
            message: 'JWT secret is not defined'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Invalid token',
                message: 'The provided token is invalid or has expired' 
            });
        }

        req.user = user as JWTPayload;
        next();
    });
}