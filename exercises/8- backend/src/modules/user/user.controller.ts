import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserRequest, LoginRequest } from "../../types";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve users",
      });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "User ID is required",
        });
        return;
      }

      const user = await this.userService.getUserById(id as string);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve user",
      });
    }
  };

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserRequest = req.body;
      const result = await this.userService.registerUser(userData);

      res.status(201).json({
        success: true,
        data: result,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Error registering user:", error);

      if (error instanceof Error) {
        if (
          error.message === "Email already registered" ||
          error.message === "Username already taken"
        ) {
          res.status(409).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: "Failed to register user",
      });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      const result = await this.userService.loginUser(loginData);

      res.json({
        success: true,
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error logging in user:", error);

      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        res.status(401).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to login",
      });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "User ID is required",
        });
        return;
      }

      const userData = req.body;

      // Ensure user can only update their own profile (unless admin)
      if (req.user?.id !== id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: Can only update your own profile",
        });
        return;
      }

      const user = await this.userService.updateUser(id as string, userData);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update user",
      });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "User ID is required",
        });
        return;
      }

      // Ensure user can only delete their own profile (unless admin)
      if (req.user?.id !== id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: Can only delete your own profile",
        });
        return;
      }

      const exists = await this.userService.userExists(id as string);
      if (!exists) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      await this.userService.deleteUser(id as string);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
      });
    }
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get current user",
      });
    }
  };
}
