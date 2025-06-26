/* recordar:
archivo encargado de ser la capa de la logica de negocio de los 
tableros usando funciones del repositorio 
ponemos las validaciones correspondientes que luego usaran
los endpoints del controlador
*/

import { BoardRepository } from "./board.repository";
import { Board} from "../../types";


export const BoardService = {
  // Obtener todos los tableros
    async getAllBoards(userId: string): Promise<Board[]> {
        return await BoardRepository.getAll(userId);
    },

    // Obtener un tablero por ID
    async getBoardById(id: string): Promise<Board | null> {
        const board = await BoardRepository.getById(id);
        return board || null; 
    },


    // crear un nuevo tablero con validacion
    async createBoard(name: string, description: string, owner_id: string): Promise<Board> {
        // decimos que si el nombre es vacio, error
        if (!name || name.trim() === "") {
            throw new Error("El nombre del tablero no puede estar vacío.");
        }
        const board=  await BoardRepository.create(
            name.trim(),
            description,
            owner_id
        );

        await BoardRepository.addPermission(board.id, owner_id, "owner");

        return board;
    },
    
    // eliminar tablero con sus tareas 
    async deleteBoard(id: string): Promise<void> {
        const board = await BoardRepository.getById(id);
        if (!board) {
            throw new Error("Tablero no encontrado");
        }
        console.log(`Eliminando tablero: ${id} y sus tareas asociadas`);
        await BoardRepository.delete(id);
    }
};

