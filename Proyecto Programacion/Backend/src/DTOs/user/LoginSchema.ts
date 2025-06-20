import { z } from "zod";

export const LoginSchema = z.object({
  alias: z.string(),
  password: z.string(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;