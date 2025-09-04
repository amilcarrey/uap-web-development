import { prisma } from '../prisma';
import { RegistrerUserDTO } from '../DTOs/user/RegistrerUserSchema';
import { UserDTO } from '../DTOs/user/UserSchema';
import { IUserService } from '../Interfaces/IUserService';
import { BoardDTO } from '../DTOs/board/BoardSchema';
import { UserSettingsDTO } from '../DTOs/settings/UserSettingsSchema';
import { Permission } from '../models/Permission'; 
import { User } from '../models/User';

export class UserDbService implements IUserService {
    
    async findUserByAlias(alias: string): Promise<UserDTO | null> {
        const user = await prisma.user.findUnique({
            where: { username: alias },
        });

        if(!user){
            return null;
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards: [],
            permissions: [],
            settings: null
        };
    }

    async findUserWithPasswordByAlias(alias: string): Promise<UserDTO & { id: number, password?: string } | null> {
        const user = await prisma.user.findUnique({
            where: { username: alias },
            select:{
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                password: true, 
            }
        });
        if (!user) return null;
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            password: user.password, 
            boards: [],
            permissions: [],
            settings: null
        };
    }


    
    async createUser(data: RegistrerUserDTO): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.alias,
                password: data.password,
            }
        });
        return new User(
            newUser.id,
            newUser.firstName,
            newUser.lastName,
            newUser.username,
            newUser.password,
            [], 
            [], 
            null 
        );
    }


    async getAllUsers(): Promise<UserDTO[]> {
        const users = await prisma.user.findMany();

        const userDTOs: UserDTO[] = users.map((u: any) => ({
            firstName: u.firstName,
            lastName: u.lastName,
            alias: u.username,
            boards: [],
            permissions: [],
            settings: null

        }));

        return userDTOs
    }

    async getUserById(userId: number): Promise<UserDTO> {
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                boards: {
                    include: {
                        tasks: true,
                        permissions: true,
                    }
                },
                permissions: true,
            },
        });

        const userSettings = await prisma.preference.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        
        const boards: BoardDTO[] = user.boards.map((board: any) => ({
            id: board.id,
            name: board.name,
            ownerId: board.ownerId,
            tasks: board.tasks.map((task: any) => ({
                id: task.id,
                content: task.content,
                active: task.active,
                boardId: task.boardId,
            })),
            permissionsId: board.permissions ? board.permissions.map((perm: any) => perm.id) : [],
            userRole: "OWNER" as const 
        }));
 
        
        const settings: UserSettingsDTO = userSettings
            ? {
                userId: userSettings.userId,
                itemsPerPage: userSettings.itemsPerPage,
                updateInterval: userSettings.updateInterval,
                upperCaseAlias: userSettings.upperCase,
            }
            : {
                userId: user.id, 
                itemsPerPage: 10,
                updateInterval: 60000,
                upperCaseAlias: false,
            };

        
        const permissions: Permission[] = user.permissions.map((perm: any) => {
            return new Permission(perm.id, perm.userId, perm.boardId, perm.level);
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards,
            permissions,
            settings,
        };
    }

    async getUsers(): Promise<UserDTO[]> {
    const users = await prisma.user.findMany({
        include: {
            boards: {
                include: {
                    tasks: true,
                    permissions: true,
                }
            },
            permissions: true,
        }
    });

    return users.map((user: any) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.username,
        password: user.password, 
        boards:[],
        permissions:[],
        settings: null 


        
    }));
}

    
    async updateUserProfile(userId: number, data: { firstName: string; lastName: string }): Promise<UserDTO> {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName
            }
        });

        return {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            alias: updatedUser.username,
            boards: [],
            permissions: [],
            settings: null
        };
    }

    
    async searchUsersByAlias(query: string): Promise<UserDTO[]> {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: query
                }
            },
            take: 10, 
            select: {
                id: true,              
                firstName: true,
                lastName: true,
                username: true
            }
        });

        return users.map((user: any) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards: [],
            permissions: [],
            settings: null,
            
            id: user.id             
        }));
    }

    
    async getAllUsersExcludingCurrent(
        currentUserId: number, 
        limit: number = 50, 
        offset: number = 0
    ): Promise<{ users: UserDTO[]; total: number }> {
        
        
        const totalCount = await prisma.user.count({
            where: {
                id: {
                    not: currentUserId
                }
            }
        });

        
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: currentUserId
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true
            },
            orderBy: {
                username: 'asc' 
            },
            take: limit,
            skip: offset
        });

        const userDTOs = users.map((user: any) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards: [],
            permissions: [],
            settings: null,
            
            id: user.id,
            createdAt: new Date().toISOString() 
        }));

        return {
            users: userDTOs,
            total: totalCount
        };
    }

}
