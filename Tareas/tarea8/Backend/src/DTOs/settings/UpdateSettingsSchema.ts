import { z } from "zod";

export const UpdateSettingsSchema = z.object({
  itemsPerPage: z.number().optional(), 
  updateInterval: z.number().optional(),
  upperCaseAlias: z.boolean().optional(),
});

export type UpdateSettingsDTO = z.infer<typeof UpdateSettingsSchema>;