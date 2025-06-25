import { database } from "../../db/connection";
import { Board } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class BoardRepository {
    async getAllBoards(): Promise<Board[]> {
        return database.all<Board>("SELECT * FROM boards", []);
    }

    async getBoardById(id: string): Promise<Board | undefined> {
        return database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]);
    }

    async createBoard(name: string, ownerId: string): Promise<Board> {
        const id = uuidv4();
        const now = new Date().toISOString();
        await database.run(
            `INSERT INTO boards (id, name, owner_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
            [id, name, ownerId, now, now]
        );

        await this.createPermission(ownerId, id, 'owner');

        const board = await this.getBoardById(id);
        if (!board) throw new Error("Board creation failed");
        return board;
    }

    async deleteBoard(id: string): Promise<boolean> {
        try {
            const board = await this.getBoardById(id);
            if (!board) {
                return false; 
            }

            await database.run(`DELETE FROM boards WHERE id = ?`, [id]);
            return true;
        } catch (error) {
            console.error("Error deleting board:", error);
            throw error; 
        }
    }

    async getBoardsByUserId(userId: string): Promise<Board[]> {
        return database.all<Board>(
            `SELECT b.* FROM boards b
            JOIN permissions p ON b.id = p.board_id
            WHERE p.user_id = ?
            ORDER BY b.created_at DESC`,
            [userId]
        );
    }
    async createPermission(userId: string, boardId: string, role: 'owner' | 'editor' | 'viewer'): Promise<void> {
        await database.run(
            `INSERT INTO permissions (user_id, board_id, role)
            VALUES (?, ?, ?)`,
            [userId, boardId, role]
        );
    }

    async getUserBoardRole(userId: string, boardId: string): Promise<string | null> {
        const permission = await database.get<{ role: string }>(
            `SELECT role FROM permissions
            WHERE user_id = ? AND board_id = ?`,
            [userId, boardId]
        );

        return permission ? permission.role : null;
    }

    async getBoardUsers(boardId: string): Promise<{ user_id: string; email: string; name: string; role: string }[]> {
        return database.all(
            `SELECT u.id as user_id, u.email, u.name, p.role
            FROM users u
            JOIN permissions p ON u.id = p.user_id
            WHERE p.board_id = ?
            ORDER BY CASE p.role
                WHEN 'owner' THEN 1
                WHEN 'editor' THEN 2
                ELSE 3
            END, u.name`,
            [boardId]
        );
    }

    async updateUserRole(userId: string, boardId: string, role: 'owner' | 'editor' | 'viewer'): Promise<boolean> {
        try {
            const existingPermission = await database.get(
                `SELECT * FROM permissions WHERE user_id = ? AND board_id = ?`,
                [userId, boardId]
            );

            if (!existingPermission) {
                return false; 
            }

            await database.run(
                `UPDATE permissions
            SET role = ?
            WHERE user_id = ? AND board_id = ?`,
                [role, userId, boardId]
            );

            const updatedPermission = await database.get(
                `SELECT role FROM permissions WHERE user_id = ? AND board_id = ? AND role = ?`,
                [userId, boardId, role]
            );

            return !!updatedPermission;
        } catch (error) {
            console.error("Error updating user role:", error);
            return false;
        }
    }

    async removePermission(userId: string, boardId: string): Promise<boolean> {
        try {
            const existingPermission = await database.get(
                `SELECT * FROM permissions WHERE user_id = ? AND board_id = ?`,
                [userId, boardId]
            );

            if (!existingPermission) {
                return false;
            }

            await database.run(
                `DELETE FROM permissions
            WHERE user_id = ? AND board_id = ?`,
                [userId, boardId]
            );

            const checkPermission = await database.get(
                `SELECT * FROM permissions WHERE user_id = ? AND board_id = ?`,
                [userId, boardId]
            );

            return !checkPermission;
        } catch (error) {
            console.error("Error removing permission:", error);
            return false;
        }
    }


}
