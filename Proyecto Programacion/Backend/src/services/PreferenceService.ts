import { prisma } from "../prisma";
import { UserSettingsDTO } from "../DTOs/settings/UserSettingsSchema";
import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsSchema";
import { IPreferenceService } from "../Interfaces/IPreferenceService";

export class PreferenceService implements IPreferenceService {
    async getPreferences(userId: number): Promise<UserSettingsDTO> {
        const pref = await prisma.preference.findUnique({ where: { userId } });
        if (!pref) {
            // Devuelve valores por defecto si no existen preferencias
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
        return {
            userId: updated.userId,
            itemsPerPage: updated.itemsPerPage,
            updateInterval: updated.updateInterval,
            upperCaseAlias: updated.upperCase,
        };
    }
}