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
        res.status(500).json({ error: error.message || "Failed to login" });
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
