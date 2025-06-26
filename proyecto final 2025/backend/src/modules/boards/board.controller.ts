/* recordar:
el controller es el que recibe las peticiones HTTP
del cliente, y este llama a los servicios del board.service.ts
para devolver los erroores o json
*/
import { Request, Response } from "express";
import { BoardService } from "./board.service";

//definit cada funcion por separado

    // endopoint get tableros
export async function getAllBoards(req: Request, res: Response) {
    try {
        const userId = req.user?.id; // Asumiendo que el usuario está autenticado y su ID está en req.user
        if (!userId) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        const boards = await BoardService.getAllBoards(userId);
        return res.json(boards);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los tableros" });
    }
}

    // get tablero por id
export async function getBoardById(req: Request, res: Response) {
    try {
        const board = await BoardService.getBoardById(req.params.id);
        if (!board) return res.status(404).json({ error: "Tablero no encontrado" });
        return res.json(board);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el tablero" });
    }
}


    // endpoint tipo post para crear tablero
export async function createBoard(req: Request, res: Response) {
    try {
        const { name, description } = req.body;
        const owner_id = req.user?.id; // Asumiendo que el usuario está autenticado y su ID está en req.user
        if (!owner_id || typeof owner_id !== "string") {
            return res.status(400).json({ error: "ID de usuario no válido o no autenticado." });
        }
        const newBoard = await BoardService.createBoard(name, description, owner_id);
        return res.status(201).json(newBoard);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
}

    // endpoint delete para eliminar tablero
export async function deleteBoard(req: Request, res: Response) {
    try {
        await BoardService.deleteBoard(req.params.id);
        return res.status(204).json();
    } catch (error) {
        return res.status(404).json({ error: (error as Error).message });
    }
}
