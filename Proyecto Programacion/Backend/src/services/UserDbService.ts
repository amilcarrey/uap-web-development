import { prisma } from '../prisma';
import { UpdateSettingsDTO } from '../DTOs/settings/UpdateSettingsDTO';
import { AuthResponseDTO } from '../DTOs/user/AuthResponseDTO';
import { LoginDTO } from '../DTOs/user/LoginDTO';
import { RegistrerUserDTO } from '../DTOs/user/RegistrerUserDTO';
import { UserDTO } from '../DTOs/user/UserDTO';
import { IUserService } from '../Interfaces/IUserService';
import { BoardDTO } from '../DTOs/board/BoardDTO';
import { UserSettingsDTO } from '../DTOs/settings/UserSettingsDTO';
import { Permission } from '../models/Permission'; // Adjust the path if needed
import { User } from '../models/User';

export class UserDbService implements IUserService {


    //Nota: Esta función debe retorna un DTO, pero se utiliza User para hacer pruebas (modificar más adelante)
    async resgisterUser(data: RegistrerUserDTO): Promise<User> {
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
    loginUser(credentials: LoginDTO): Promise<AuthResponseDTO> {
        throw new Error('Method not implemented.');
    }
    logoutUser(userId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getCurrentUser(userId: number): Promise<UserDTO> {
        throw new Error('Method not implemented.');
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
            name: board.name,
            active: board.active,
            ownerId: board.ownerId,
            tasks: board.tasks.map(task => ({
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


    updateUserSettings(userId: number, settings: UpdateSettingsDTO): Promise<UserDTO> {
        throw new Error('Method not implemented.');
    }

}