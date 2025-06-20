import { z } from "zod";
import { TaskSchema } from '../task/TaskSchema';

export const BoardSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  ownerId: z.number(),
  tasks: z.array(TaskSchema),
  permissionsId: z.array(z.number()),
});

export type BoardDTO = z.infer<typeof BoardSchema>;