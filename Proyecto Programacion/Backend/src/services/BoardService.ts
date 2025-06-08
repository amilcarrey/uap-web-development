import { prisma } from '../prisma';
import { CreateBoardDTO } from '../DTOs/board/CreateBoardDTO';
import { Board } from '../models/Board';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Permission } from '../models/Permission';
import { PermissionLevel } from '../models/Permission';

export class BoardService {
    async createBoard(userId: number, data: CreateBoardDTO): Promise<Board> {
        const board = await prisma.board.create({
            data: {
                name: data.name,
                active: data.active,
                ownerId: userId,
            },
            include: {
                owner: true,
                tasks: true,
                permissions: true,
            },
        });

        const owner = new User(
            board.owner.id,
            board.owner.firstName,
            board.owner.lastName,
            board.owner.username,
            board.owner.password,
            [], // boards
            [], // permissions
            null // preference
        );

        // Mapear tasks y permissions a instancias de clase
        const tasks = board.tasks.map(
            t => new Task(t.id, t.content, t.active)
        );

        const permissions = board.permissions.map(
            p => new Permission(
                p.id,
                p.userId,
                p.boardId,
                PermissionLevel[p.level as keyof typeof PermissionLevel]
            )
        );

        return new Board(
            board.id,
            board.name,
            board.active,
            owner,
            tasks,
            permissions
        );
    }
}