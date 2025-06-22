import {Request, Response} from "express";
import { AuthService } from "../services/AuthService";
import { LoginDTO, LoginSchema } from "../DTOs/user/LoginSchema";
import { RegistrerUserDTO, RegistrerUserSchema } from "../DTOs/user/RegistrerUserSchema";

const authService = new AuthService();


export class AuthController{

    //Registrar un usuario
    static async register(req: Request, res: Response){
        try{
            //Valido el body con zod
            const parseResult = RegistrerUserSchema.safeParse(req.body);
            if(!parseResult.success){
                const error = new Error("Datos invalidos");
                (error as any).status = 400;
                (error as any).details = parseResult.error.errors;
                throw error;
            }

            //Llamo al servico de autenticación para registrar al nuevo usario
            const user = await authService.registerUser(parseResult.data as RegistrerUserDTO);

            //Retirno el usuario con su token
            res.status(201).json(user);
        }catch (error) {
            throw error;
        }
    };


    static async login(req: Request, res: Response){
        try{
            //console.log("Entro al login");
            //Valido el body con zod
            const parseResult = LoginSchema.safeParse(req.body);
            if(!parseResult.success){
                res.status(400).json({ error: "Datos invalidos", details: parseResult.error.errors });
                return; 
            }

            //console.log("Se validaron los datos con zod");
            //Llamo al servicio de autenticación para loguear al usuario
            const user = await authService.loginUser(parseResult.data as LoginDTO);

            //console.log("Se continua seteando el token en la cookie");
            //Seteo el token en la cookie
            res.cookie("token", user.token, {
                httpOnly: true,
                secure: true, // solo en HTTPS en producción
                signed: true,
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días
            });

            res.json({ user });

            //console.log("Se retorno el usuario");

        }catch(error : any){
            if (error.name === "ZodError") {
                res.status(400).json({ error: error.errors });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie("token");
        res.json({message: "Logged out"});
    }
}
