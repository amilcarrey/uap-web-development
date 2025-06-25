import { z } from "zod";

export const CreateBoardSchema = z.object({
  name: z.string(),
});

export type CreateBoardDTO = z.infer<typeof CreateBoardSchema>;