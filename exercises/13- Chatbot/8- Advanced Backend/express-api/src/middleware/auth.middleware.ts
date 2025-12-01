import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { AuthRepository } from '../modules/auth/auth.repository';
import { JwtPayload, User, BoardPermission } from '../types';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
        boardPermission?: BoardPermission; // o tu tipo BoardPermission
    }
}

// Factory function o dependency injection
const createAuthService = () => {
    const authRepository = new AuthRepository();
    return new AuthService(authRepository);
};

// Función para extraer token de múltiples fuentes
const extractToken = (req: Request): string | null => {
    // Prioridad: Cookie > Authorization header
    return req.cookies['auth-token'] || 
        req.headers.authorization?.replace('Bearer ', '') || 
        null;
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Access token required',
                code: 'NO_TOKEN'
            });
        }
        
        const authService = createAuthService();
        const decoded = authService.verifyToken(token) as JwtPayload;
        const user = await authService.getUserById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }
        
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Authentication error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        
        return res.status(401).json({ 
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
        });
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req);
        
        if (token) {
            const authService = createAuthService();
            const decoded = authService.verifyToken(token) as JwtPayload;
            const user = await authService.getUserById(decoded.userId);
            
            if (user) {
                req.user = user; 
            }
        }
        
        next();
    } catch (error) {
        console.debug('Optional auth failed:', error instanceof Error ? error.message : 'Unknown error');
        next();
    }
};
