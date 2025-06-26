import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Board } from "../entities/Board";
import { BoardUser } from "../entities/BoardUser";
import { User } from "../entities/User";

export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const user = (req as any).user as User;

    const boardRepo = AppDataSource.getRepository(Board);
    const boardUserRepo = AppDataSource.getRepository(BoardUser);

    const board = new Board();
    board.title = title;
    await boardRepo.save(board);

    // Crear relación como owner
    const boardUser = new BoardUser();
    boardUser.board = board;
    boardUser.user = user;
    boardUser.permission = "owner";
    await boardUserRepo.save(boardUser);

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as User;
    const boardUserRepo = AppDataSource.getRepository(BoardUser);

    const boards = await boardUserRepo.find({
      where: { userId: user.id },
      relations: ["board"],
    });

    res.json(
      boards.map((bu) => ({
        id: bu.board.id,
        title: bu.board.title,
        permission: bu.permission,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const boardRepo = AppDataSource.getRepository(Board);
    const board = await boardRepo.findOneBy({ id: Number(boardId) });
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const shareBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { email, permission } = req.body;

    if (!["owner", "edit", "read"].includes(permission)) {
      res.status(400).json({ message: "Invalid permission type" });
      return;
    }

    const userRepo = AppDataSource.getRepository(User);
    const boardUserRepo = AppDataSource.getRepository(BoardUser);

    const userToShare = await userRepo.findOneBy({ email });
    if (!userToShare) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verificar que no existe ya la relación
    let boardUser = await boardUserRepo.findOneBy({
      boardId: Number(boardId),
      userId: userToShare.id,
    });

    if (boardUser) {
      boardUser.permission = permission;
    } else {
      boardUser = new BoardUser();
      boardUser.boardId = Number(boardId);
      boardUser.userId = userToShare.id;
      boardUser.permission = permission;
    }
    await boardUserRepo.save(boardUser);
    res.json({ message: "Shared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const boardRepo = AppDataSource.getRepository(Board);

    const board = await boardRepo.findOneBy({ id: Number(boardId) });
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    await boardRepo.remove(board);

    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
