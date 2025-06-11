import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, User } from "../types";
import { database } from "../db/connection";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Access token required",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Get user from database to ensure they still exist
    const user = await database.get<Omit<User, "password_hash">>(
      "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token expired",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Authentication error",
      });
    }
  }
};
