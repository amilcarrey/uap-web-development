import { z } from "zod";
import { TaskSchema } from '../task/TaskSchema';

export const BoardSchema = z.object({
  id: z.number(),
  name: z.string(),
  ownerId: z.number(),
  tasks: z.array(TaskSchema),
  permissionsId: z.array(z.number()),
  userRole: z.enum(["OWNER", "EDITOR", "VIEWER"]),
});

export type BoardDTO = z.infer<typeof BoardSchema>;