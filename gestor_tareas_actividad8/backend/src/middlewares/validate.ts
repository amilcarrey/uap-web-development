import { ZodSchema } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function validate(
  schema: ZodSchema,
  source: 'body' | 'params' | 'query' = 'body'
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      res.status(400).json({
        error: 'Validación fallida',
        issues: result.error.format(),
      });
      return; // corta la ejecución, pero no devuelve un valor → cumple con tipo `void`
    }

    req[source] = result.data;
    next();
  };
}
