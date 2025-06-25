import { Board } from "../../types";
import { BoardRepository } from "../board/board.repository";
import { AuthService } from "../auth/auth.service";



export class BoardService {
    constructor(
        private boardRepository: BoardRepository,
        private readonly authService?: AuthService
    ) {}

    getAllBoards(): Promise<Board[]> {
        return this.boardRepository.getAllBoards();
    }

     async getUserBoards(userId: string): Promise<Board[]> {
        return this.boardRepository.getBoardsByUserId(userId);
    }

    

    async getBoardById(id: string, userId: string): Promise<Board | null> {
        const board = await this.boardRepository.getBoardById(id);
        if (!board) {
            return null;
        }

        const role = await this.boardRepository.getUserBoardRole(userId, id);
        if (!role) {
            return null; 
        }

        return board;
    
    }

    createBoard(name: string, ownerId: string): Promise<Board> {
        return this.boardRepository.createBoard(name, ownerId);
    }

    async deleteBoard(id: string, userId: string): Promise<boolean> {
    const board = await this.boardRepository.getBoardById(id);
    if (!board) return false;
    
    const role = await this.boardRepository.getUserBoardRole(userId, id);
    
    if (board.owner_id === userId || role === 'owner') {
        return this.boardRepository.deleteBoard(id);
    }
    
    return false; 
}

    

    

    async getBoardUsers(boardId: string, userId: string): Promise<{ user_id: string; email: string; name: string; role: string }[] | null> {
        const role = await this.boardRepository.getUserBoardRole(userId, boardId);
        if (!role) {
            return null; 
        }

        return this.boardRepository.getBoardUsers(boardId);
    }

    async addUserToBoard(boardId: string, userEmail: string, role: 'editor' | 'viewer', currentUserId: string): Promise<boolean> {
        const currentUserRole = await this.boardRepository.getUserBoardRole(currentUserId, boardId);
        if (currentUserRole !== 'owner') {
            return false; 
        }

        if (!this.authService) {
            throw new Error("AuthService is required to add users to boards");
        }

        const userToAdd = await this.authService.getUserByEmail(userEmail);
        if (!userToAdd) {
            return false; 
        }
        const existingRole = await this.boardRepository.getUserBoardRole(userToAdd.id, boardId);
        
        if (existingRole) {
            
            return this.boardRepository.updateUserRole(userToAdd.id, boardId, role);
        } else {
            
            await this.boardRepository.createPermission(userToAdd.id, boardId, role);
            return true;
        }
    }

    async removeUserFromBoard(boardId: string, userIdToRemove: string, currentUserId: string): Promise<boolean> {
    
    if (currentUserId === userIdToRemove) {
        return false;
    }
    
    const board = await this.boardRepository.getBoardById(boardId);
    if (!board) return false;
    
    if (board.owner_id === currentUserId) {
        return this.boardRepository.removePermission(userIdToRemove, boardId);
    }
    
    const currentUserRole = await this.boardRepository.getUserBoardRole(currentUserId, boardId);
    const userToRemoveRole = await this.boardRepository.getUserBoardRole(userIdToRemove, boardId);
    
    if (currentUserRole?.toLowerCase() === 'owner' && 
        userToRemoveRole?.toLowerCase() !== 'owner') {
        return this.boardRepository.removePermission(userIdToRemove, boardId);
    }
    
    return false;
}

async getUserBoardRole(userId: string, boardId: string): Promise<string | null> {
    return this.boardRepository.getUserBoardRole(userId, boardId);
}

    
    


}
