import { Request, Response } from "express";
import { PreferenceService } from "../services/PreferenceService";
import { UpdateSettingsSchema } from "../DTOs/settings/UpdateSettingsSchema";

const preferenceService = new PreferenceService();

export class PreferenceController {
    static async getPreferences(req: Request, res: Response) {
        const userId = (req as any).user?.id;
        try {
            const prefs = await preferenceService.getPreferences(userId);
            res.json(prefs);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener preferencias", details: error instanceof Error ? error.message : String(error) });
        }
    }

    static async updatePreferences(req: Request, res: Response) {
        const userId = (req as any).user?.id;
        const parseResult = UpdateSettingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: "Datos inválidos", details: parseResult.error.errors });
            return;
        }
        try {
            const prefs = await preferenceService.updatePreferences(userId, parseResult.data);
            res.json(prefs);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar preferencias", details: error instanceof Error ? error.message : String(error) });
        }
    }
}