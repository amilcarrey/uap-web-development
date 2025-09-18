import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { RegistrerUserDTO } from "../DTOs/user/RegistrerUserSchema";
import { AuthResponseDTO } from "../DTOs/user/AuthResponseSchema";
import { LoginDTO } from "../DTOs/user/LoginSchema";
import { UserDbService } from "./UserDbService";

const prisma = new PrismaClient();
const userService = new UserDbService();

export class AuthService {
    
    async registerUser(data: RegistrerUserDTO): Promise<AuthResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { username: data.alias }
        });

        if (user) {
            const error = new Error("El alias ya está registrado");
            (error as any).status = 400;
            throw error;
        }

        const hashedPassword = await argon2.hash(data.password);
        

        const newUser = await userService.createUser({ ...data, password: hashedPassword });

        const token = jwt.sign(
            { id: newUser.id, alias: newUser.username },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "10d" }
        );

        return {
            token,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                alias: newUser.username,
            }
        };
    }

    
    async loginUser(data: LoginDTO): Promise<AuthResponseDTO> {
        const user = await userService.findUserWithPasswordByAlias(data.alias);
        if (!user) {
            const error = new Error("Alias Invalido");
            (error as any).status = 400;
            throw error;
        }

        if (!user.password) {
            const error = new Error("No se encontró la contraseña del usuario.");
            (error as any).status = 500;
            throw error;
        }

        const validPassword = await argon2.verify(user.password, data.password);
        if (!validPassword) {
            const error = new Error("Contraseña Invalida");
            (error as any).status = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, alias: user.alias },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "10d" }
        );

        return {
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                alias: user.alias
            }
        };
    }
}
