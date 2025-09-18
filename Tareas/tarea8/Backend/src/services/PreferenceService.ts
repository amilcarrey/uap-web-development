import { prisma } from "../prisma";
import { UserSettingsDTO } from "../DTOs/settings/UserSettingsSchema";
import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsSchema";
import { IPreferenceService } from "../Interfaces/IPreferenceService";

export class PreferenceService implements IPreferenceService {
    async getPreferences(userId: number): Promise<UserSettingsDTO> {
        if (!userId) {
            const error = new Error("ID de usuario no proporcionado");
            (error as any).status = 400;
            throw error;
        }
        const pref = await prisma.preference.findUnique({ where: { userId } });
        if (!pref) {
            
            return {
                userId,
                itemsPerPage: 10,
                updateInterval: 60000,
                upperCaseAlias: false,
            };
        }
        return {
            userId: pref.userId,
            itemsPerPage: pref.itemsPerPage,
            updateInterval: pref.updateInterval,
            upperCaseAlias: pref.upperCase,
        };
    }

    async updatePreferences(userId: number, data: UpdateSettingsDTO): Promise<UserSettingsDTO> {
        if (!userId) {
            const error = new Error("ID de usuario no proporcionado");
            (error as any).status = 400;
            throw error;
        }
        if (!data) {
            const error = new Error("Datos de preferencia no proporcionados");
            (error as any).status = 400;
            throw error;
        }
        const updated = await prisma.preference.upsert({
            where: { userId },
            update: {
                itemsPerPage: data.itemsPerPage,
                updateInterval: data.updateInterval,
                upperCase: data.upperCaseAlias,
            },
            create: {
                userId,
                itemsPerPage: data.itemsPerPage ?? 10,
                updateInterval: data.updateInterval ?? 60000,
                upperCase: data.upperCaseAlias ?? false,
            }
        });
        if (!updated) {
            const error = new Error("No se pudieron actualizar las preferencias");
            (error as any).status = 500;
            throw error;
        }
        return {
            userId: updated.userId,
            itemsPerPage: updated.itemsPerPage,
            updateInterval: updated.updateInterval,
            upperCaseAlias: updated.upperCase,
        };
    }
}
