import { prisma } from '../prisma';
import { UpdateSettingsDTO } from '../DTOs/settings/UpdateSettingsSchema';
import { AuthResponseDTO } from '../DTOs/user/AuthResponseSchema';
import { LoginDTO } from '../DTOs/user/LoginSchema';
import { RegistrerUserDTO } from '../DTOs/user/RegistrerUserSchema';
import { UserDTO } from '../DTOs/user/UserSchema';
import { IUserService } from '../Interfaces/IUserService';
import { BoardDTO } from '../DTOs/board/BoardSchema';
import { UserSettingsDTO } from '../DTOs/settings/UserSettingsSchema';
import { Permission } from '../models/Permission'; // Adjust the path if needed
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
                password: true, // Incluimos la contraseña para la verificación
            }
        });
        if (!user) return null;
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            password: user.password, // Incluimos la contraseña para la verificación
            boards: [],
            permissions: [],
            settings: null
        };
    }


    //Nota: Esta función debe retorna un DTO, pero se utiliza User para hacer pruebas (modificar más adelante)
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
            [], // boards vacío al crear
            [], // permissions vacío al crear
            null // settings/preference vacío al crear
        );
    }


    async getAllUsers(): Promise<UserDTO[]> {
        const users = await prisma.user.findMany();

        const userDTOs: UserDTO[] = users.map(u => ({
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
        /*
        Obtiene un usuario por su Id, incluyendo sus boards, permisos y su configuración.
        @param userId - El ID del usuario a buscar.
        @returns Una promesa que resuelve a un objeto UserDTO con los detalles del usuario.
        */
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

        // Mapear boards a BoardDTO
        const boards: BoardDTO[] = user.boards.map(board => ({
            id: board.id,
            name: board.name,
            ownerId: board.ownerId,
            tasks: board.tasks.map(task => ({
                id: task.id,
                content: task.content,
                active: task.active,
                boardId: task.boardId,
            })),
            permissionsId: board.permissions ? board.permissions.map((perm: any) => perm.id) : [],
        }));
 
        // Mapear settings a UserSettingsDTO
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

        // Map plain permission objects to Permission class instances
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

    return users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.username,
        password: user.password, // Incluimos la contraseña para la verificación
        boards:[],
        permissions:[],
        settings: null // Puedes agregar lógica para traer settings si lo necesitas


        /*
        boards: user.boards.map(board => ({
            name: board.name,
            active: board.active,
            ownerId: board.ownerId,
            tasks: board.tasks.map(task => ({
                content: task.content,
                active: task.active,
                boardId: task.boardId,
            })),
            permissionsId: board.permissions ? board.permissions.map((perm: any) => perm.id) : [],
        })),
        permissions: user.permissions ? user.permissions.map((perm: any) => ({
            id: perm.id,
            userId: perm.userId,
            boardId: perm.boardId,
            level: perm.level
        })) : [],
        settings: null // Puedes agregar lógica para traer settings si lo necesitas
        */
    }));
}

    // Actualizar perfil del usuario
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

    // Buscar usuarios por alias
    async searchUsersByAlias(query: string): Promise<UserDTO[]> {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: query
                }
            },
            take: 10, // Limitar a 10 resultados
            select: {
                id: true,              // ← ✅ Agregar ID al select
                firstName: true,
                lastName: true,
                username: true
            }
        });

        return users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards: [],
            permissions: [],
            settings: null,
            // Campos adicionales para compatibilidad
            id: user.id             // ← ✅ Incluir ID en el resultado
        }));
    }

    // Obtener todos los usuarios excluyendo al usuario actual (con paginación)
    async getAllUsersExcludingCurrent(
        currentUserId: number, 
        limit: number = 50, 
        offset: number = 0
    ): Promise<{ users: UserDTO[]; total: number }> {
        
        // Contar total de usuarios (excluyendo el actual)
        const totalCount = await prisma.user.count({
            where: {
                id: {
                    not: currentUserId
                }
            }
        });

        // Obtener usuarios con paginación
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
                username: 'asc' // Ordenar alfabéticamente por alias
            },
            take: limit,
            skip: offset
        });

        const userDTOs = users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.username,
            boards: [],
            permissions: [],
            settings: null,
            // Campos adicionales para compatibilidad
            id: user.id,
            createdAt: new Date().toISOString() // Placeholder temporal
        }));

        return {
            users: userDTOs,
            total: totalCount
        };
    }

}