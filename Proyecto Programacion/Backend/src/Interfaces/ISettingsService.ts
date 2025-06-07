import { UserSettingsDTO } from "../DTOs/settings/UserSettingsDTO"
import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsDTO"

export interface ISettingsService{
    getSettings(userId: number): Promise<UserSettingsDTO>
    updateSettings(userId: number, settings: UpdateSettingsDTO): Promise<UserSettingsDTO>
}

/*
getSettings(userId: string): Promise<UserSettingsDto>
updateSettings(userId: string, settings: UpdateSettingsDto): Promise<UserSettingsDto>

*/