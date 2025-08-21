import { Request, Response } from "express";
import { PreferenceService } from "../services/PreferenceService";
import { UpdateSettingsSchema } from "../DTOs/settings/UpdateSettingsSchema";

const preferenceService = new PreferenceService();

export class PreferenceController {
    static async getPreferences(req: Request, res: Response) {
        const userId = (req as any).user?.id;
        if (!userId) {
            const error = new Error("Usuario no autenticado");
            (error as any).status = 401;
            throw error;
        }
        const prefs = await preferenceService.getPreferences(userId);
        res.json(prefs);
    }

    static async updatePreferences(req: Request, res: Response) {
        const userId = (req as any).user?.id;
        if (!userId) {
            const error = new Error("Usuario no autenticado");
            (error as any).status = 401;
            throw error;
        }
        const parseResult = UpdateSettingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            const error = new Error("Datos inválidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }
        const prefs = await preferenceService.updatePreferences(userId, parseResult.data);
        res.json(prefs);
    }
}