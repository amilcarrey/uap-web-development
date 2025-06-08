import { Request, Response } from 'express';
import { BoardService } from '../services/BoardService';

const boardService = new BoardService();

export class BoardController {
  static async createBoard(req: Request, res: Response) {
    try {
      const userId = Number(req.body.userId); // O de req.user si usas autenticación
      const board = await boardService.createBoard(userId, req.body);
      res.status(201).json(board);
    } catch (error) {
      res.status(500).json({ error: 'Error creating board' });
    }
  }
}