import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { CreateUserRequest, LoginRequest } from "./auth.dto";
import { AuthRequest } from "../../middleware/auth.middleware";

const authService = new AuthService(new AuthRepository());

export const register = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    const user = await authService.register(userData);
    res.status(201).json(user);
  } catch (err: any) {
    const status = err.message === "El usuario ya existe" ? 409 : 400;
    res.status(status).json({ error: err.message || "Error en el registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginData: LoginRequest = req.body;
    const result = await authService.login(loginData);

    // Guardar el token en una cookie httpOnly
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    });

    res.json({ nombre: result.nombre, role: result.role });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Error de autenticación" });
  }
};

export const me = (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) throw new Error("No autenticado");
    res.json({ nombre: req.nombre, userId: req.userId });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "No autenticado" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};