import { Request, Response } from "express";
import { BoardService } from "./board.service";

export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    createBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const { name } = req.body;
            if (!name || typeof name !== 'string' || name.trim() === '') {
                res.status(400).json({ message: "El nombre del tablero es requerido" });
                return;
            }

            const board = await this.boardService.createBoard(name, userId);
            res.status(201).json(board);
        } catch (error) {
            console.error("Error al crear tablero:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getUserBoards = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const boards = await this.boardService.getUserBoards(userId);
            res.json(boards);
        } catch (error) {
            console.error("Error al obtener tableros:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getBoardById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const boardId = req.params.id;
            const board = await this.boardService.getBoardById(boardId, userId);

            if (!board) {
                res.status(404).json({ message: "Tablero no encontrado o sin acceso" });
                return;
            }

            res.json(board);
        } catch (error) {
            console.error("Error al obtener tablero:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    deleteBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const boardId = req.params.id;
            const success = await this.boardService.deleteBoard(boardId, userId);

            if (!success) {
                res.status(403).json({ message: "No tienes permiso para eliminar este tablero" });
                return;
            }

            res.json({ message: "Tablero eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar tablero:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getBoardUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const boardId = req.params.id;
            const users = await this.boardService.getBoardUsers(boardId, userId);

            if (users === null) {
                res.status(403).json({ message: "No tienes acceso a este tablero" });
                return;
            }

            res.json({ users,currentUserId: userId  });
        } catch (error) {
            console.error("Error al obtener usuarios del tablero:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    addUserToBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuario no autenticado" });
                return;
            }

            const boardId = req.params.id;
            const { email, role } = req.body;
            

            if (!email || !role) {
                res.status(400).json({
                    message: "Se requiere un email válido"
                });
                return;
            }
            if (role !== 'editor' && role !== 'viewer') {
                res.status(400).json({ message: "Rol inválido. Debe ser 'editor' o 'viewer'" });
                return;
            }

            const success = await this.boardService.addUserToBoard(
                boardId,
                email,
                role as 'editor' | 'viewer',
                userId
            );

            if (!success) {
                res.status(403).json({
                    message: "No se pudo añadir al usuario. Verifica que tengas permisos y que el usuario exista."
                });
                return;
            }

            res.json({ message: "Usuario añadido al tablero correctamente" });
        } catch (error) {
            console.error("Error al añadir usuario al tablero:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

removeUserFromBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }

        const boardId = req.params.id;
        const userIdToRemove = req.params.userId;

        console.log("Intento de eliminar usuario:", {
            boardId,
            currentUserId: userId,
            userIdToRemove
        });

        const success = await this.boardService.removeUserFromBoard(
            boardId,
            userIdToRemove,
            userId
        );

        if (success) {
            res.json({ message: "Usuario eliminado del tablero correctamente" });
        } else {
            res.status(403).json({ 
                message: "No se pudo eliminar al usuario. Verifica que tengas permisos y que el usuario no sea el propietario." 
            });
        }
    } catch (error) {
        console.error("Error al eliminar usuario del tablero:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

   
}