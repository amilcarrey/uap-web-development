import { RegistrerUserDTO } from "../DTOs/user/RegistrerUserSchema";
import { User } from "../models/User";
import { UserDTO } from "../DTOs/user/UserSchema";

export interface IUserService {

    createUser(data: RegistrerUserDTO): Promise<User>;
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(userId: number): Promise<UserDTO>;
    findUserByAlias(alias: string): Promise<UserDTO | null>;
    findUserWithPasswordByAlias(alias: string): Promise<UserDTO | null>
}
