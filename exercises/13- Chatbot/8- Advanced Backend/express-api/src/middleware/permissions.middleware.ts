import { Request, Response, NextFunction } from 'express';
import { PermissionRepository } from '../modules/permissions/permission.repository';


const permissionRepository = new PermissionRepository();

// Middleware para requerir permiso específico en un tablero
export const requireBoardPermission = (requiredLevel: 'viewer' | 'editor' | 'owner') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // ✅ Validar autenticación ANTES de verificar permisos
            if (!req.user) {
                res.status(401).json({ 
                    error: 'Authentication required',
                    code: 'UNAUTHORIZED' 
                });
                return;
            }

            // Obtener boardId de los parámetros
            const boardId = parseInt(req.params.boardId || req.params.id);
            if (isNaN(boardId)) {
                res.status(400).json({ 
                    error: 'Invalid board ID',
                    code: 'INVALID_BOARD_ID' 
                });
                return;
            }

            // ✅ Verificar permisos usando tu repository existente
            const hasPermission = await permissionRepository.userHasPermission(
                boardId, 
                req.user.id, 
                requiredLevel
            );

            if (!hasPermission) {
                res.status(403).json({ 
                    error: 'Insufficient permissions',
                    required: requiredLevel,
                    code: 'INSUFFICIENT_PERMISSIONS'
                });
                return;
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ 
                error: 'Permission check failed',
                code: 'PERMISSION_CHECK_ERROR' 
            });
        }
    };
};

// Shortcuts para permisos específicos
export const requireBoardOwnership = requireBoardPermission('owner');
export const requireBoardEditPermission = requireBoardPermission('editor');
export const requireBoardViewPermission = requireBoardPermission('viewer');

// Middleware opcional para inyectar información de permisos
export const injectBoardPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const boardId = parseInt(req.params.boardId || req.params.id);
        
        if (user && !isNaN(boardId)) {
            const permission = await permissionRepository.getBoardPermission(boardId, user.id);
            // Inyectar el permiso en el request para uso posterior
            (req as any).boardPermission = permission;
        }
        
        next();
    } catch (error) {
        console.error('Error injecting permissions:', error);
        next(); // Continúa sin inyectar permisos
    }
};