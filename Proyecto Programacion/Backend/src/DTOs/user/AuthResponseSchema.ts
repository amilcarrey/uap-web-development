import { z } from "zod";

export const AuthResponseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
});

export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;