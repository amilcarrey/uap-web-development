import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserRequest } from "./auth.dto";
import { validate } from "class-validator";
import { signToken } from "../../utils/jwt";
import { AuthedRequest } from "../../types/express/index";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new CreateUserRequest();
      dto.email = req.body.email;
      dto.password = req.body.password;

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          errors: errors.map((e) => Object.values(e.constraints || {})).flat(),
        });
        return;
      }

      const existingUser = await this.authService.getUserByEmail(dto.email);
      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }

      const user = await this.authService.createUser(dto);
      const token = signToken({ userId: user.id });

      res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, 
      });

      const { password: _, ...safeUser } = user;
      res.status(201).json({ user: safeUser });
    } catch (error) {
      console.error("Error en register:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }

      const user = await this.authService.validateUser(email, password);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = signToken({ userId: user.id });

      res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  };

  logout = (req: Request, res: Response): void => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  };

  getCurrentUser = async (req: AuthedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await this.authService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Error en getCurrentUser:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  };
}
