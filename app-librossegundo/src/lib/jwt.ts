
import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secretStr = process.env.JWT_SECRET;
  if (!secretStr) throw new Error("JWT_SECRET no configurado");
  return new TextEncoder().encode(secretStr);
}

export async function signJWT(payload: Record<string, unknown>, exp = "7d") {
  const secret = getSecret();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJWT(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub?: string; email?: string; [k: string]: unknown };
}
