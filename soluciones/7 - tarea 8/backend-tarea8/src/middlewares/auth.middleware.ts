import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { BoardUser } from "../entities/BoardUser";

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const secret = process.env.JWT_SECRET!;
    const payload: any = jwt.verify(token, secret);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: payload.id });
    if (!user) {
      res.status(401).json({ message: "Invalid token user" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
    // No return aquí
  }
};

export const authorizeBoardPermission = (requiredPermissions: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const boardId = Number(req.params.boardId || req.body.boardId);
    if (!boardId) {
      res.status(400).json({ message: "Board ID required" });
      return;
    }

    const boardUserRepo = AppDataSource.getRepository(BoardUser);

    const boardUser = await boardUserRepo.findOneBy({
      userId: req.user!.id,
      boardId,
    });

    if (!boardUser || !requiredPermissions.includes(boardUser.permission)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};
