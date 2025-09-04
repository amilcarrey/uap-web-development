import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload{
    id: number;
    alias: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    
    let token = req.signedCookies?.token || req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }
    
    if (token.startsWith('s:')) {
        token = token.slice(2);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as JwtPayload;
        
        if (!decoded.id) {
            res.status(401).json({ error: "Token inválido: ID de usuario no encontrado" });
            return;
        }
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.log('Error al verificar el token:', error); 
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
    }
};
