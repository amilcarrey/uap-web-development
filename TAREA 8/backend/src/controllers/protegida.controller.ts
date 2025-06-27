import { Request, Response } from 'express';

export const rutaProtegida = (req: Request, res: Response) => {
  const usuario = req.usuario;
  res.json({
    mensaje: 'estoy en una ruta protegida',
    usuario,
  });
};
