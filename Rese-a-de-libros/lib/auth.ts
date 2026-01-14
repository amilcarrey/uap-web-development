import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";

export interface Payload {
  email: string;
  iat?: number;
  exp?: number;
}

export function generarToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): Payload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch (err) {
    return null;
  }
}
