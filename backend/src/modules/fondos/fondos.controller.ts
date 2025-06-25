import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import db from "../../db/knex";
import { v4 as uuidv4 } from "uuid";

// Obtener fondos del usuario
export const obtenerFondos = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) throw new Error("No autenticado");
        const fondos = await db("user_fondos").where({ user_id: userId }).select("url");
        res.json({ fondos: fondos.map(f => f.url) });
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
        await db("user_fondos").insert({ id: uuidv4(), user_id: userId, url });
        res.json({ ok: true });
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