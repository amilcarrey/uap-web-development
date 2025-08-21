import { z } from "zod";

export const RegistrerUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  password: z.string(),
});

export type RegistrerUserDTO = z.infer<typeof RegistrerUserSchema>;