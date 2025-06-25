import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getUserConfig, upsertUserConfig } from "./user_config.service";

export const obtenerConfig = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) throw new Error("No autenticado");
        const config = await getUserConfig(userId);
        res.json(config || {});
    } catch (error: any) {
        if (error.message === "No autenticado") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Error al obtener configuración" });
        }
    }
};

export const guardarConfig = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) throw new Error("No autenticado");
        const { intervaloRefetch, tareasPorPagina, descripcionMayusculas } = req.body;
        const config = await upsertUserConfig(userId, {
            intervalo_refetch: intervaloRefetch,
            tareas_por_pagina: tareasPorPagina,
            descripcion_mayusculas: descripcionMayusculas,
        });
        res.json(config);
    } catch (error: any) {
        if (error.message === "No autenticado") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Error al guardar configuración" });
        }
    }
};