// src/middleware/validation.middleware.ts
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log("Validating request:", req.method, req.path, errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

export const validateBoardCreation: RequestHandler[] = [
    body('name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Board name must be 1-100 characters'),
    validateRequest as RequestHandler
];

export const validateTodoCreation: RequestHandler[] = [
    body('text')
        .isLength({ min: 1, max: 500 })
        .withMessage('Todo text must be 1-500 characters'),
    validateRequest as RequestHandler
];

export const validateBoardUpdate: RequestHandler[] = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Board name must be 1-100 characters')
        .escape(),
    validateRequest as RequestHandler
];

export const validateTodoUpdate: RequestHandler[] = [
    body('text')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Todo text must be 1-500 characters')
        .escape(),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean'),
    validateRequest as RequestHandler
];

export const validatePagination: RequestHandler[] = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validateRequest as RequestHandler
];