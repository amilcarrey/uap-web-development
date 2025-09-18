import { z } from "zod";

export const CreateTaskSchema = z.object({
  content: z.string(),
  active: z.boolean(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;