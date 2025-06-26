// src/validators/authValidatorXd.ts
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const authSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(100).required(),
});

// Middleware de validación
export const validateAuth = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = authSchema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    res.status(400).json({ error: errorMessage });
    return;
  }
  
  next();
};
