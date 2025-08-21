import {Request, Response} from "express";
import { AuthService } from "../services/AuthService";
import { LoginDTO, LoginSchema } from "../DTOs/user/LoginSchema";
import { RegistrerUserDTO, RegistrerUserSchema } from "../DTOs/user/RegistrerUserSchema";

const authService = new AuthService();


export class AuthController{

    static async register(req: Request, res: Response){
        const parseResult = RegistrerUserSchema.safeParse(req.body);
        if(!parseResult.success){
            const error = new Error("Datos invalidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }

        const user = await authService.registerUser(parseResult.data as RegistrerUserDTO);

        res.status(201).json(user);
    };


    static async login(req: Request, res: Response){

        const parseResult = LoginSchema.safeParse(req.body);
        if(!parseResult.success){
            const error = new Error("Datos invalidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }

        const user = await authService.loginUser(parseResult.data as LoginDTO);

        res.cookie("token", user.token, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });

        res.json({ user });

    }

    static async logout(req: Request, res: Response) {
        res.clearCookie("token");
        res.json({message: "Logged out"});
    }

    static async getMe(req: Request, res: Response) {
        const currentUser = (req as any).user;
        
        if (!currentUser) {
            const error = new Error("Usuario no autenticado");
            (error as any).status = 401;
            throw error;
        }

        const userService = new (await import('../services/UserDbService')).UserDbService();
        const userDetails = await userService.getUserById(currentUser.id);
        
        if (!userDetails) {
            const error = new Error("Usuario no encontrado");
            (error as any).status = 404;
            throw error;
        }

        res.json({
            id: currentUser.id,
            alias: userDetails.alias,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName
        });
    }
}
