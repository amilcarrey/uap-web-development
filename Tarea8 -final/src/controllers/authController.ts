import { Request, Response } from "express";
import { registerUser, loginUser } from "../service/authService";
import { prisma } from "../prisma";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    await registerUser(username, password);
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// LOGIN
// LOGIN (corregido)
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Desestructura el objeto devuelto por loginUser
    const { token, user } = await loginUser(username, password);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({ user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};



// LOGOUT
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada" });
};


export const me = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: "No autenticado" });
    res.json({ user: { id: user.id, username: user.username } });
  } catch {
    res.status(401).json({ error: "No autenticado" });
  }
};