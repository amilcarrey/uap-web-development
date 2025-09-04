import { z } from "zod";

export const TaskQuerySchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type TaskQueryDTO = z.infer<typeof TaskQuerySchema>;