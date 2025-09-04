import { z } from "zod";
import { PermissionLevel } from "../../models/Permission";

export const UserPermissionSchema = z.object({
  userId: z.number(),
  boardId: z.number(),
  levelAccess: z.nativeEnum(PermissionLevel),
});

export type UserPermissionDTO = z.infer<typeof UserPermissionSchema>;