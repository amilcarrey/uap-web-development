import { z } from "zod";

export const CreateBoardSchema = z.object({
  name: z.string(),
  active: z.boolean(),
});

export type CreateBoardDTO = z.infer<typeof CreateBoardSchema>;