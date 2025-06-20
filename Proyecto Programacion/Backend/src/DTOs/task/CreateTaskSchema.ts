import { z } from "zod";

export const CreateTaskSchema = z.object({
  boardId: z.number(),
  content: z.string(),
  active: z.boolean(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;