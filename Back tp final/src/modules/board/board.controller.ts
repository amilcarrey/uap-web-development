import {Request, Response} from 'express';
import {BoardService} from './board.service';
import {CreateBoardRequest} from '../../types';
import {PermissionService} from '../permission/permission.service'; // Importa el servicio de permisos

export class BoardController {
  constructor(
    private readonly boardService: BoardService,
  ) {}

  getAllBoards = async (req: Request, res: Response): Promise<void> => {
    try {
      const boards = await this.boardService.getAllBoards();
      console.log('Donde estan mis boardddssss');
      res.json({boards});
    } catch (error) {
      console.error('Error getting boards:', error);
      res.status(500).json({error: 'Failed to retrieve boards'});
    }
  };

getBoardsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    //console.log('Request user:', req.user);
    const user_id = req.user?.id;
    if (!user_id) {
      res.status(401).json({error: 'Falta el user Id'});
      return;
    }
    //console.log('User ID from request:', user_id);
    //console.log("User ID from request:", req.user);
    
    const boards = await this.boardService.getBoardsByUserId(user_id);
    //console.log('Boards for user:', boards);
    res.json({ boards });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener boards' });
  }
};

  getBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const {id} = req.params;
      const board = await this.boardService.getBoardById(id);

      if (!board) {
        res.status(404).json({error: 'Board not found'});
        return;
      }

      res.json({board});
    } catch (error) {
      console.error('Error getting board:', error);
      res.status(500).json({error: 'Failed to retrieve board'});
    }
  };

  createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('=== DEBUG CREATE BOARD ===');
      console.log('Headers authorization:', req.headers.authorization);
      console.log('req.user:', req.user);
      console.log('req.body:', req.body);
      
      const owner_id = req.user?.id;
      console.log('owner_id extraído:', owner_id);
      
      if (!owner_id) {
        console.log('ERROR: owner_id es null o undefined');
        res.status(401).json({error: 'Falta  el user Id'});
        return;
      }

      const boardData: CreateBoardRequest = {
        ...req.body,
        owner_id: owner_id
      };
console.log('boardData final:', boardData);
      if (!boardData.name) {
        //console.log("Este es mi boardDataa", boardData)
        res.status(400).json({error: 'Falta el nombre del board'});
        return;
      }

      const board = await this.boardService.createBoard(boardData);
      res.status(201).json({board});
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({error: 'Failed to create board'});
    }
  };

  deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const {id} = req.params;

      if (!(await this.boardService.boardExists(id))) {
        res.status(404).json({error: 'Board not found'});
        return;
      }

      await this.boardService.deleteBoard(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({error: 'Failed to delete board'});
    }
  };


  inviteUser = async (req: Request, res: Response) => {
    const board_id = req.params.board_id;
    const { user_id, access_level } = req.body;
    const ownerId = req.user?.id;

    console.log("=== INVITE USER BACKEND DEBUG ===");
    console.log("Board ID from params:", board_id);
    console.log("User ID from body:", user_id);
    console.log("Access level from body:", access_level);
    console.log("Owner ID from req.user:", ownerId);

    if (!board_id || !user_id || !access_level) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (!ownerId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    try {
      await this.boardService.inviteUserToBoard(ownerId, user_id, board_id, access_level);
      res.status(201).json({ message: "Usuario invitado correctamente" });
    } catch (err: any) {
      console.error("Error invitando usuario:", err);
      
      // Manejo específico de errores
      if (err.message === "No tienes permisos para invitar usuarios") {
        return res.status(403).json({ error: err.message });
      } else if (err.message === "El usuario ya tiene permisos en este board") {
        return res.status(409).json({ error: err.message });
      }
      
      res.status(500).json({ error: "No se pudo invitar al usuario" });
    }
  };
}
