import { Request, Response } from "express";
import { BoardService } from "./board.service";
import { PermissionsService } from "../permissions/permission.service";
import { MutateBoardDto } from "../../types";

export class BoardController {
    constructor(private boardService: BoardService, private permissionsService: PermissionsService) {}

    getAllBoards = async (req: Request, res: Response): Promise<void> => {
        try {

            const userId = req.user!.id; 
            const boards = await this.boardService.getAllBoards(userId);
            if (!boards || boards.length === 0) {
                res.status(404).json({ error: 'No boards found for this user' });
                return;
            }
            res.json(boards);
        } catch (error) {
            console.error('Error fetching boards:', error);
            res.status(500).json({ error: 'Failed to fetch boards' });
        }
    };

    getAllUserBoards = async (req: Request, res: Response): Promise<void> => {
        try{
            const userId = req.user!.id; 
            
            // obtemer tableros donde tiene permisos
            const boardsWithPermissions = await this.permissionsService.getUserBoards(userId);

            // obtener detalles de los tableros con información del owner
            const boards = await Promise.all(
                boardsWithPermissions.map(async (boardPermission) => {
                    const boardDetails = await this.boardService.getBoardById(boardPermission.board_id);
                    const owner = await this.boardService.getBoardOwner(boardPermission.board_id);
                    
                    return {
                        ...boardDetails,
                        user_permission: boardPermission.permission_level,
                        owner: {
                            id: owner?.id,
                            username: owner?.username,
                            email: owner?.email
                        }
                    };
                })
            );

            res.json(boards);
        } catch (error) {
            console.error('Error fetching user boards:', error);
            res.status(500).json({ error: 'Failed to fetch user boards' });
        }
    }

    getBoardById = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const userId = req.user!.id;

            // Verificar que el usuario tiene acceso al tablero (por ahora solo propietario)
            const canAccess = await this.boardService.canAccessBoard(boardId, userId);
            if (!canAccess) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const board = await this.boardService.getBoardById(boardId);
            
            if (!board) {
                res.status(404).json({ error: 'Board not found' });
                return;
            }
    
            res.json(board);
        } catch (error) {
            console.error('Error fetching board:', error);
            res.status(500).json({ error: 'Failed to fetch board' });
        }
    };

    createBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardData: MutateBoardDto = req.body;
            const userId = req.user!.id;

            if (!boardData.name) {
                res.status(400).json({ error: "Name is required" });
                return;
            }

            const board = await this.boardService.createBoard(boardData, userId);
            res.status(201).json(board);
        } catch (error) {
            console.error('Error creating board:', error);
            res.status(500).json({ error: 'Failed to create board' });
        }
    }

    deleteBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const userId = req.user!.id;

            // Verificar que el usuario tiene acceso al tablero (por ahora solo propietario)
            const canAccess = await this.boardService.canAccessBoard(boardId, userId);
            if (!canAccess) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const deleted = await this.boardService.deleteBoard(boardId);

            if (!deleted) {
                res.status(404).json({ error: 'Board not found' });
                return;
            }

            res.json(deleted);
        } catch (error) {
            console.error('Error deleting board:', error);
            res.status(500).json({ error: 'Failed to delete board' });
        }
    }

    updateBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const boardData: MutateBoardDto = req.body;
            const userId = req.user!.id;

            // Verificar que el usuario tiene acceso al tablero
            const canAccess = await this.boardService.canAccessBoard(boardId, userId);
            if (!canAccess) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            if (!boardData.name) {
                res.status(400).json({ error: "Name is required" });
                return;
            }

            const updatedBoard = await this.boardService.updateBoard(boardId, boardData);
            
            if (!updatedBoard) {
                res.status(404).json({ error: 'Board not found' });
                return;
            }
            
            res.json(updatedBoard);
        } catch (error) {
            console.error('Error updating board:', error);
            res.status(500).json({ error: 'Failed to update board' });
        }
    }
}