import { z } from "zod";

export const UpdateBoardSchema = z.object({
  name: z.string().optional(),
  active: z.boolean().optional(),
});

export type UpdateBoardDTO = z.infer<typeof UpdateBoardSchema>;