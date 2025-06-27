import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];


      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`El campo '${rule.field}' es requerido`);
        continue;
      }


      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }


      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`El campo '${rule.field}' debe ser una cadena de texto`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`El campo '${rule.field}' debe ser un número`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`El campo '${rule.field}' debe ser verdadero o falso`);
            }
            break;
          case 'email':
            if (typeof value !== 'string' || !isValidEmail(value)) {
              errors.push(`El campo '${rule.field}' debe ser un email válido`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`El campo '${rule.field}' debe ser un array`);
            }
            break;
        }
      }


      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push(`El campo '${rule.field}' debe tener al menos ${rule.minLength} caracteres`);
      }


      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push(`El campo '${rule.field}' no puede tener más de ${rule.maxLength} caracteres`);
      }


      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push(`El campo '${rule.field}' debe ser mayor o igual a ${rule.min}`);
      }


      if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
        errors.push(`El campo '${rule.field}' debe ser menor o igual a ${rule.max}`);
      }


      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`El campo '${rule.field}' debe ser uno de: ${rule.enum.join(', ')}`);
      }


      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors.push(typeof customResult === 'string' ? customResult : `El campo '${rule.field}' no es válido`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: 'Errores de validación', details: errors });
      return;
    }

    next();
  };
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


export const validationRules = {
  registro: [
    { field: 'nombre', required: true, type: 'string' as const, minLength: 2, maxLength: 100 },
    { field: 'email', required: true, type: 'email' as const },
    { field: 'contraseña', required: true, type: 'string' as const, minLength: 6, maxLength: 100 }
  ],
  login: [
    { field: 'email', required: true, type: 'email' as const },
    { field: 'contraseña', required: true, type: 'string' as const }
  ],
  tablero: [
    { field: 'nombre', required: true, type: 'string' as const, minLength: 1, maxLength: 200 },
    { field: 'descripcion', required: false, type: 'string' as const, maxLength: 500 }
  ],
  tarea: [
    { field: 'titulo', required: true, type: 'string' as const, minLength: 1, maxLength: 300 },
    { field: 'descripcion', required: false, type: 'string' as const, maxLength: 1000 },
    { field: 'prioridad', required: false, enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'] }
  ],
  compartirTablero: [
    { field: 'emailUsuario', required: true, type: 'email' as const },
    { field: 'rol', required: true, enum: ['PROPIETARIO', 'EDITOR', 'LECTOR'] }
  ],
  configuracion: [
    { field: 'intervaloActualizacion', required: false, type: 'number' as const, min: 5, max: 300 },
    { field: 'mostrarCompletadas', required: false, type: 'boolean' as const },
    { field: 'ordenarPor', required: false, enum: ['creadoEn', 'titulo', 'prioridad', 'completadoEn'] },
    { field: 'notificaciones', required: false, type: 'boolean' as const }
  ]
};
