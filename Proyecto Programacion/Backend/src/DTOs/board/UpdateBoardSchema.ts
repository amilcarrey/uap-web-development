import { z } from "zod";

export const UpdateBoardSchema = z.object({
  name: z.string().optional(),
});

export type UpdateBoardDTO = z.infer<typeof UpdateBoardSchema>;