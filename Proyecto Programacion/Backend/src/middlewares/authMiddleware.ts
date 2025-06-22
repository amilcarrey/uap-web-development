import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload{
    id: number;
    alias: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        res.status(401).json({error: "Token no proporcionado"});
        return;
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as JwtPayload;
        (req as any).user = decoded; // Agrego el usuario decodificado al request para que esté disponible en las siguientes capas
        next();
    }catch(error){
        res.status(401).json({error: "Token inválido o expirado"});
        return;
    }
};