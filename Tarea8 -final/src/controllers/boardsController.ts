import { Request, Response } from "express";
import * as boardsService from "../service/boardsService";

// Crear un nuevo tablero
export const createBoard = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req as any).user.userId;

  try {
    const board = await boardsService.createBoard(name, userId);
    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener los tableros del usuario autenticado
export const getMyBoards = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const boards = await boardsService.getMyBoards(userId);
    res.json(boards);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const shareBoard = async (req: Request, res: Response) => {
  const { boardId, targetUsername, role } = req.body;
  const userId = (req as any).user.userId;
  try {
    const result = await boardsService.shareBoard(boardId, targetUsername, role, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBoardPermissions = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  const userId = (req as any).user.userId;
  console.log("Buscando permisos para:", { boardId, userId });
  try {
    const permissions = await boardsService.getBoardPermissions(boardId, userId);
    console.log("Permisos encontrados:", permissions);
    res.json(permissions);
  } catch (error: any) {
        console.error("Error al obtener permisos:", error.message);
    res.status(403).json({ error: error.message });
  }
};

export const updateBoardPermission = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  const { targetUserId, role } = req.body;
  const userId = (req as any).user.userId;

  try {
    const result = await boardsService.updateBoardPermission(boardId, targetUserId, role, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const removeBoardPermission = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  const targetUserId = req.params.targetUserId;
  const userId = (req as any).user.userId;
  try {
    const result = await boardsService.removeBoardPermission(boardId, targetUserId, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  const userId = (req as any).user.userId;
  try {
    const result = await boardsService.deleteBoard(boardId, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
