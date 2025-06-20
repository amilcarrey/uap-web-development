import { RegistrerUserDTO } from "../DTOs/user/RegistrerUserSchema";
import { User } from "../models/User";
import { LoginDTO } from "../DTOs/user/LoginSchema";
import { AuthResponseDTO } from "../DTOs/user/AuthResponseSchema";
import { UserDTO } from "../DTOs/user/UserSchema";
import { UpdateSettingsDTO } from "../DTOs/settings/UpdateSettingsSchema";

export interface IUserService {

    resgisterUser(data: RegistrerUserDTO): Promise<User>;
    loginUser(credentials: LoginDTO): Promise<AuthResponseDTO>;
    logoutUser(userId: number): Promise<void>;
    getCurrentUser(userId: number): Promise<UserDTO>;
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(userId: number): Promise<UserDTO>;
    updateUserSettings(userId: number, settings: UpdateSettingsDTO): Promise<UserDTO>;
}


/* 
registerUser(data: RegisterUserDto): Promise<User>
loginUser(credentials: LoginDto): Promise<AuthResponseDto>
logoutUser(userId: string): Promise<void>
getCurrentUser(userId: string): Promise<UserDto>
getUserById(userId: string): Promise<UserDto>
updateUserSettings(userId: string, settings: UpdateSettingsDto): Promise<UserDto>
*/