import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "nando"; 

export const registerUser = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("Faltan datos");
  }

  // Verificar si ya existe
  const userExists = await prisma.user.findUnique({ where: { username } });
  if (userExists) {
    throw new Error("El usuario ya existe");
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashed,
    }
  });
};

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) throw new Error("Credenciales inválidas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user }; 
};

