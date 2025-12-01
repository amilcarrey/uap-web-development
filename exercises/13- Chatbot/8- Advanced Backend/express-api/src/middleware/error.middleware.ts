import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Diferentes tipos de errores
    if (error.name === 'ValidationError') {
        res.status(400).json({ 
            error: 'Validation failed', 
            details: error.message 
        });
    }

    if (error.name === 'UnauthorizedError') {
        res.status(401).json({ 
            error: 'Unauthorized' 
        });
    }

    if (error.name === 'ForbiddenError') {
        res.status(403).json({ 
            error: 'Forbidden' 
        });
    }

    // Error genérico
    res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
};