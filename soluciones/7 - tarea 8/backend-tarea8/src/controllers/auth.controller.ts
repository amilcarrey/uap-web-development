import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
    await userRepo.save(user);
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.json({ message: "Logged in" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  res.json({ id: user.id, email: user.email });
};
