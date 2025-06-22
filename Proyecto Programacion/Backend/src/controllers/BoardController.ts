import { Request, Response } from 'express';
import { BoardService } from '../services/BoardDbService';
import { error } from 'console';
import { UpdateBoardSchema } from '../DTOs/board/UpdateBoardSchema';
import { parse } from 'dotenv';
import { prisma } from '../prisma';
const boardService = new BoardService();

export class BoardController {

  static async getBoards(req: Request, res: Response) {
    try {
      const boards = await boardService.getBoards();
      res.json(boards);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener todos los tableros',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }


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
        res.status(404).json({error: 'No se encontro el tablero'});
        return;
      }
      res.json(board);
    }catch(error){
      res.status(500).json({ error: 'Error al obtener el tablero', details: error instanceof Error ? error.message : error });
    }
  }

  //Actualizar un tablero
  static async updateBoard(req: Request, res: Response){
    const boardId = Number(req.params.boardId);
    const currentUserId = (req as any).user?.id;

    //Validar los datos de entrada con Zod
    const parseResult = UpdateBoardSchema.safeParse(req.body);

    if(!parseResult.success){
       res.status(400).json({ error: "Datos inválidos", details: parseResult.error.errors });
       return;
    }

    try {
      // Busca el tablero y sus permisos
      const board = await prisma.board.findUnique({
          where: { id: boardId },
          include: { permissions: true }
      });
      if (!board) {
        res.status(404).json({ error: "Tablero no encontrado" });
        return;
      }

      // ¿Es dueño?
      if (board.ownerId === currentUserId) {
          // Permitir
      } else {
          // ¿Tiene permiso EDITOR?
          const permission = board.permissions.find(p => p.userId === currentUserId && p.level === "EDITOR");
          if (!permission) {
            res.status(403).json({ error: "No tienes permiso para modificar este tablero" });
            return;
          }
      }

      // ...actualiza el tablero
      const updateBoard = await boardService.updateBoard(boardId, req.body);
      res.status(200).json(updateBoard);
    }catch(error: any){
      if (error.message === "Board not found") {
         res.status(404).json({ error: "Tablero no encontrado" });
      }
       res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  //Eliminar un tablero
  static async deleteBoard(req: Request, res: Response){
    try{
      const userId = Number(req.params.userId);
      const boardId = Number(req.params.boardId);

      if(isNaN(userId) || isNaN(boardId)){
         res.status(400).json({error: 'Id invalido'});
         return;
      }

      await boardService.deleteBoard(userId, boardId);
      res.status(400).send();

    }catch(error: any){
      if(error.message === 'Tablero no encontrado'){
         res.status(404).json({ error: error.message });
      }
      if (error.message === 'No tienes permiso para eliminar este tablero') {
         res.status(403).json({ error: error.message });
      }
       res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
  }

}