import { z } from "zod";

export const UserSettingsSchema = z.object({
  userId: z.number(),
  itemsPerPage: z.number(),
  updateInterval: z.number(),
  upperCaseAlias: z.boolean(),
});

export type UserSettingsDTO = z.infer<typeof UserSettingsSchema>;