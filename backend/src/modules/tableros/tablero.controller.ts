import { Request, Response } from "express";
import { obtenerTableros, crearTablero } from "./tablero.model";

export const listarTableros = async (_: Request, res: Response) => {
  const tableros = await obtenerTableros();
  res.json(tableros);
};

export const agregarTablero = async (req: Request, res: Response) => {
  const { nombre } = req.body;
  await crearTablero(nombre);
  res.status(201).json({ mensaje: "Tablero creado" });
};
