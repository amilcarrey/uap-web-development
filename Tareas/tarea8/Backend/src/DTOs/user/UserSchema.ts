import { z } from "zod";
import { BoardSchema } from "../board/BoardSchema";
import { UserSettingsSchema } from "../settings/UserSettingsSchema";
import { PermissionLevel } from "../../models/Permission";


export const PermissionSchema = z.object({
  userId: z.number(),
  boardId: z.number(),
  level: z.nativeEnum(PermissionLevel),
});

export const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  password: z.string().optional(), 
  boards: z.array(BoardSchema),
  permissions: z.array(PermissionSchema),
  settings: UserSettingsSchema.nullable(),
});

export type UserDTO = z.infer<typeof UserSchema>;
