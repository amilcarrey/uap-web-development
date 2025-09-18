import { z } from "zod";

export const UpdateTaskSchema = z.object({
  content: z.string().optional(),
  active: z.boolean().optional(),
});

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;