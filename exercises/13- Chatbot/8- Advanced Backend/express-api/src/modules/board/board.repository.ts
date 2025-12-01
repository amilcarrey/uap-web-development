import database from '../../db/connection';
import { Board, MutateBoardDto, User } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class BoardRepository {
    async getAllBoards(owner_id: number): Promise<Board[]> {
        return database.all<Board>(
            `SELECT * FROM boards 
            WHERE owner_id = ? 
            ORDER BY created_at ASC`,
            [owner_id]
        );
    }

    async getBoardById(id: number): Promise<Board | undefined> {
        return database.get<Board>(
            `SELECT * FROM boards 
            WHERE id = ?`,
            [id]
        );
    }

    async createBoard(data: MutateBoardDto, owner_id: number): Promise<Board> {
        const { name } = data;

        await database.run(
            `INSERT INTO boards (name, owner_id, created_at, updated_at) 
            VALUES (?, ?, datetime('now'), datetime('now'))`,
            [name, owner_id]
        );

        // En SQLite, last_insert_rowid() obtiene el ID del último registro insertado
        const result = await database.get<{ id: number }>('SELECT last_insert_rowid() as id');
        const boardId = result?.id || 0;

        // NUEVO: Crear automáticamente el permiso de owner
        await database.run(
            `INSERT INTO board_permissions (board_id, user_id, permission_level, created_at)
            VALUES (?, ?, 'owner', datetime('now'))`,
            [boardId, owner_id]
        );

        const board = await this.getBoardById(boardId);
        if (!board) {
            throw new Error('Failed to create board');
        }

        return board;
    }

    async deleteBoard(id: number): Promise<boolean> {
        await database.run(`DELETE FROM boards WHERE id = ?`, [id]);
        return true;
    }    
    
    async canAccessBoard(boardId: number, userId: number): Promise<boolean> {
        const board = await this.getBoardById(boardId);         
        return board ? board.owner_id === userId : false;
    }

    async boardExists(boardId: number): Promise<boolean> {
        const board = await this.getBoardById(boardId);
        return !!board;
    }

    async updateBoard(id: number, data: MutateBoardDto): Promise<Board | undefined> {
        const { name } = data;

        await database.run(
            `UPDATE boards SET name = ?, updated_at = datetime('now') WHERE id = ?`,
            [name, id]
        );

        return this.getBoardById(id);
    }

    async getBoardOwner(boardId: number): Promise<User | undefined> {
        return database.get<User>(
            `SELECT u.* FROM users u
            JOIN boards b ON u.id = b.owner_id
            WHERE b.id = ?`,
            [boardId]
        );
    }

}