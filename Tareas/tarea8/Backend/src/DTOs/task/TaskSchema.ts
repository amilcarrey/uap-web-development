import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number(),
  content: z.string(),
  active: z.boolean(),
  boardId: z.number(),
});

export type TaskDTO = z.infer<typeof TaskSchema>;