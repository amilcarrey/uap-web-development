import { CreateUserRequest } from "./auth.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";


export class AuthController {
  constructor(private readonly authService: AuthService) {}

  getAllUsers = async (_: Request, res: Response) => {
    const users = await this.authService.getAllUsers();
    res.json({ users });
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserRequest = req.body;
      console.log("Received user data:", userData);

      if (!userData.name) {
        return res.status(400).json({ error: "Name is required" });
      }

      if (!userData.password) {
        return res.status(400).json({ error: "Password is required" });
      }
      if (userData.name.length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters long" });
      }
      if (userData.password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
       // Verificar si el username ya existe
      const existingUser = await this.authService.findUserByUsername(userData.name);
      if (existingUser) {
        return res.status(409).json({ 
          error: "El nombre de usuario ya está en uso. Por favor, elige otro." 
        });
      }


      const user = await this.authService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message || "Failed to create user" });
      } else {
        res.status(500).json({ error: "Failed to create user"  });
      }
    }
  };
    
  login = async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;
      console.log(name, password);
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }
      const token = await this.authService.login(name, password);
      res.cookie("token", token, {
        secure: false, //set true para producción... osea never jajan´t
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
      res.json({ token });
    } catch (error) {
      //res.status(500).json({ error: "Failed to login" });
      if (error instanceof Error) {
        res.status(402).json({ error: error.message || "Failed to login" });
      } else {
        res.status(500).json({ error: "Failed to login" });
      }

    }
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  };
}
