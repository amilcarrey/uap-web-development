import { Request, Response } from "express";
import { SettingsRepository } from "./settings.repository";

export const SettingsController = {
  async getSettings(req: Request, res: Response) {
    const userId = req.user!.id;
    const settings = await SettingsRepository.getByUserId(userId);
    res.json(settings);
  },

  async updateSettings(req: Request, res: Response) {
    const userId = req.user!.id;
    const updated = await SettingsRepository.update(userId, req.body);
    res.json(updated);
  },
};
