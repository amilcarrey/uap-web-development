import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {RegistrerUserDTO} from "../DTOs/user/RegistrerUserSchema";
import { AuthResponseDTO } from "../DTOs/user/AuthResponseSchema";
import { LoginDTO } from "../DTOs/user/LoginSchema";
import { UserDbService } from "./UserDbService";


const prisma = new PrismaClient();
const userService = new UserDbService();
export class AuthService{
    

    //Crea un usuario, hashea la contraseña y genera un token JWT
    async registerUser(data: RegistrerUserDTO): Promise<AuthResponseDTO>{
        //. Valido el objeto con el esquema de validación
        const user = await prisma.user.findUnique({
            where: {username: data.alias}
        });

        if(user){
            throw new Error("El alias ya está registrado");
        }

        // Encripto la contraseña con argon2
        const hashedPassword = await argon2.hash(data.password);

        // Creo el usuario en la base de datos con Prisma
        const newUser = await userService.registerUser({...data, password: hashedPassword});
        
        // Genero un token JWT con la información del usuario
        const token = jwt.sign(
            {id: newUser.id, alias: newUser.username},
            process.env.JWT_SECRET || "default_secret",
            {expiresIn: "10d"}
        );

        // Retorno el token y la información del usuario
        return {
            token,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                alias: newUser.username,
            }
        }
    };

    //Verifica usuario y contraseña, y genera un JWT
    async loginUser(data: LoginDTO): Promise<AuthResponseDTO>{
        //Busco al usuario por su alias
        const user = await userService.findUserWithPasswordByAlias(data.alias);
        if(!user){
            throw new Error("Alias Invalido");
        }

        //Verifico la contraseña
        if (!user.password) {
            throw new Error("No se encontró la contraseña del usuario.");
        }

        const validPassword = await argon2.verify(user.password, data.password);
        if(!validPassword){
            throw new Error("Contraseña Invalida");
        }

        // Genero un token JWT con la información del usuario
        const token = jwt.sign(
            { id: user.id, alias: user.alias },
            process.env.JWT_SECRET || "default_secret",
            {expiresIn: "10d"}
        );

        // Retorno el token y la información del usuario
        return {
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                alias: user.alias
            }
        };
    };
}