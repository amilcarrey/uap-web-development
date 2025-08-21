import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsSchema";
import { UserSettingsDTO } from "../DTOs/settings/UserSettingsSchema";

export interface IPreferenceService {
    getPreferences(userId: number): Promise<UserSettingsDTO>;
    updatePreferences(userId: number, data: UpdateSettingsDTO): Promise<UserSettingsDTO>
}