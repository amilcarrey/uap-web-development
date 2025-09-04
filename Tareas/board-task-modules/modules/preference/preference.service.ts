import { PreferenceRepository } from "./preference.repository";
import { PreferenceDto, UpdatePreferenceDto } from "./preference.dto";

export class PreferenceService {
  private repo = new PreferenceRepository();

  async getPreference(userId: number): Promise<PreferenceDto | null> {
    return this.repo.findByUserId(userId);
  }

  async updatePreference(userId: number, data: UpdatePreferenceDto): Promise<PreferenceDto> {
    return this.repo.update(userId, data);
  }
}
