import { Request, Response } from 'express';
import { BoardService } from '../services/BoardDbService';
import { UpdateBoardSchema } from '../DTOs/board/UpdateBoardSchema';
import { prisma } from '../prisma';
const boardService = new BoardService();

export class BoardController {

  static async getBoards(req: Request, res: Response) {
    const boards = await boardService.getBoards();
    res.json(boards);
  }

  static async createBoard(req: Request, res: Response) {
    const { userId, name, active } = req.body;
    if (!userId || isNaN(Number(userId))) {
      const error = new Error("ID de usuario inválido");
      (error as any).status = 400;
      throw error;
    }
    if (!name) {
      const error = new Error("El nombre del tablero es obligatorio");
      (error as any).status = 400;
      throw error;
    }
    const board = await boardService.createBoard(Number(userId), { name, active });
    res.status(201).json(board);
  }

  static async getBoardsByuser(req: Request, res: Response){
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      const error = new Error("ID de usuario inválido");
      (error as any).status = 400;
      throw error;
    }
    const board = await boardService.getBoardsForUser(userId);
    res.json(board);
  }

  static async getBoardById(req: Request, res: Response){
    const boardId = Number(req.params.boardId);
    if (isNaN(boardId)) {
      const error = new Error("ID de tablero inválido");
      (error as any).status = 400;
      throw error;
    }
    const board = await boardService.getBoardById(boardId);
    if(!board){
      const error = new Error('No se encontro el tablero');
      (error as any).status = 404;
      throw error;
    }
    res.json(board);
  }

  static async updateBoard(req: Request, res: Response){
    const boardId = Number(req.params.boardId);
    const currentUserId = (req as any).user?.id;

    if (isNaN(boardId)) {
      const error = new Error("ID de tablero inválido");
      (error as any).status = 400;
      throw error;
    }
    if (!currentUserId) {
      const error = new Error("Usuario no autenticado");
      (error as any).status = 401;
      throw error;
    }

    const parseResult = UpdateBoardSchema.safeParse(req.body);
    if(!parseResult.success){
      const error = new Error("Datos inválidos");
      (error as any).status = 400;
      (error as any).details = parseResult.error.errors;
      throw error;
    }

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { permissions: true }
    });
    if (!board) {
      const error = new Error("Tablero no encontrado");
      (error as any).status = 404;
      throw error;
    }

    if (board.ownerId === currentUserId) {
        // Permitir
    } else {
        const permission = board.permissions.find(p => p.userId === currentUserId && p.level === "EDITOR");
        if (!permission) {
          const error = new Error("No tienes permiso para modificar este tablero");
          (error as any).status = 403;
          throw error;
        }
    }

    const updateBoard = await boardService.updateBoard(boardId, req.body);
    res.status(200).json(updateBoard);
  }

  static async deleteBoard(req: Request, res: Response){
    const userId = Number(req.params.userId);
    const boardId = Number(req.params.boardId);

    if(isNaN(userId) || isNaN(boardId)){
      const error = new Error('Id invalido');
      (error as any).status = 400;
      throw error;
    }

    // Busca el tablero y sus permisos
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { permissions: true }
    });
    if (!board) {
      const error = new Error("Tablero no encontrado");
      (error as any).status = 404;
      throw error;
    }

    // Validar si es dueño o tiene permiso EDITOR
    if (board.ownerId === userId) {
      // Permitir
    } else {
      const permission = board.permissions.find(
        p => p.userId === userId && p.level === "EDITOR"
      );
      if (!permission) {
        const error = new Error("No tienes permiso para eliminar este tablero");
        (error as any).status = 403;
        throw error;
      }
    }

    await boardService.deleteBoard(userId, boardId);
    res.status(204).send();
  }
}