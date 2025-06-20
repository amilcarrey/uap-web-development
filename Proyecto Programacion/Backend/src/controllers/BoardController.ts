import { Request, Response } from 'express';
import { BoardService } from '../services/BoardService';
import { error } from 'console';

const boardService = new BoardService();

export class BoardController {

  //Crear Tablero
  static async createBoard(req: Request, res: Response) {
    try {
      const { userId, name, active } = req.body;
      const board = await boardService.createBoard(Number(userId), { name, active });
      res.status(201).json(board);
    } catch (error) {
      console.error('Error creating board:', error); // <-- Agrega esto
      res.status(500).json({
        error: 'Error creating board',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  //Obtener tableros del usuario
  static async getBoardsByuser(req: Request, res: Response){
    try{
      const userId = Number(req.params.userId);
      const board = await boardService.getBoardsForUser(userId);
      res.json(board);
    }catch(error){
      res.status(500).json({ error: 'Error al obtener tableros', details: error instanceof Error ? error.message : error });
    }
  }

  //Encontrar un tablero por el Id
  static async getBoardById(req: Request, res: Response){
    try{
      const boardId = Number(req.params.boardId);
      const board = await boardService.getBoardById(boardId);
      if(!board){
        return res.status(404).json({error: 'No se encontro el tablero'});
      }
      res.json(board);
    }catch(error){
      res.status(500).json({ error: 'Error al obtener el tablero', details: error instanceof Error ? error.message : error });
    }
  }

}