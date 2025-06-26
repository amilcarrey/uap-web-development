import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import * as fondosService from "./fondos.service";

// Obtener fondos del usuario
export const obtenerFondos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) throw new Error("No autenticado");
    const fondos = await fondosService.obtenerFondos(userId);
    res.json({ fondos });
  } catch (error: any) {
    if (error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al obtener fondos" });
    }
  }
};

// Agregar fondo (URL) para el usuario
export const agregarFondo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { url } = req.body;
    if (!userId) throw new Error("No autenticado");
    if (!url) throw new Error("Falta la URL");
    const fondo = await fondosService.agregarFondo(userId, url);
    res.json({ ok: true, fondo });
  } catch (error: any) {
    if (error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else if (error.message === "Falta la URL") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al agregar fondo" });
    }
  }
};

// Eliminar fondo por id
export const eliminarFondo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    if (!userId) throw new Error("No autenticado");
    if (!id) throw new Error("Falta el id del fondo");
    const deleted = await fondosService.eliminarFondo(userId, id);
    if (deleted) {
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "Fondo no encontrado" });
    }
  } catch (error: any) {
    if (error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else if (error.message === "Falta el id del fondo") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al eliminar fondo" });
    }
  }
};