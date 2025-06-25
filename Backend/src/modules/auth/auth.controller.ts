import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserRequest, LoginRequest } from "./auth.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  getAllUsers = async (_: Request, res: Response): Promise<void> => {
    try {
      const users = await this.authService.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserRequest = req.body;

      if (!userData.email || !userData.password || !userData.name) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }

      const user = await this.authService.createUser(userData);
      
      const token = await this.authService.login(userData.email, userData.password);
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      
      res.status(201).json({ user });
    } catch (error) {
      console.error("Error creating user:", error);
      
      if (error instanceof Error) {
        if (error.message === "Ya existe un usuario con este correo electrónico") {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginRequest = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son requeridos" });
        return;
      }
      
      const token = await this.authService.login(email, password);
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      
      res.json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error("Error durante login:", error);
      
      if (error instanceof Error && error.message === "Invalid credentials") {
        res.status(401).json({ error: "Email o contraseña inválidos" });
        return;
      }
      
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  logout = (_: Request, res: Response): void => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada exitosamente" });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      
      const user = await this.authService.getUserById(req.user.id);
      
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      
      res.json({ user });
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}