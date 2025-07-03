import { RegistrerUserDTO } from "../DTOs/user/RegistrerUserSchema";
import { User } from "../models/User";
import { LoginDTO } from "../DTOs/user/LoginSchema";
import { AuthResponseDTO } from "../DTOs/user/AuthResponseSchema";
import { UserDTO } from "../DTOs/user/UserSchema";
import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsSchema";

export interface IUserService {

    createUser(data: RegistrerUserDTO): Promise<User>;
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(userId: number): Promise<UserDTO>;
    findUserByAlias(alias: string): Promise<UserDTO | null>;
    findUserWithPasswordByAlias(alias: string): Promise<UserDTO | null>
}