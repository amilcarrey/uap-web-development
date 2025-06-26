import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";

const service = new AuthService(new AuthRepository());

export const AuthController = {

    register: async (req: Request, res: Response) => {
        const data: CreateUserRequest = req.body;
        if (!data.email || !data.password) {
            return res.status(400).json({ error: "falta email o password" });
        }
        try {
            const user = await service.createUser(data);
            res.status(201).json(user);
        }catch (e) {
            console.error("Error al crear el usuario:", e); 
            res.status(400).json({ error: "Error al crear el usuario",  e });
        }
    },


    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const token = await service.login(email, password);
            res.cookie("token", token, {
                httpOnly: true,
                signed: true, // Cambiar a true si se usa una clave secreta para firmar cookies
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
            });
            console.log("Token generado:", token);
            return res.json({ token });
        } catch (e) {
            console.error("Error al iniciar sesión:", e);
            res.status(401).json({ error: "Credenciales inválidas", e });
        }
    },


    // ruta para el usuario logueado
    // auth.controller.ts
    me: async (req: Request, res: Response) => {
        try {
            const user = req.user; 
            if (!user) return res.status(401).json({ error: "No autenticado" });

            return res.json({
            id: user.id,
            email: user.email,
            });
        } catch (e) {
            res.status(500).json({ error: "Error al obtener el perfil" });
        }
    },

    logout: (_: Request, res: Response) => {
        res.clearCookie("token");
        res.json({ message: "Logout exitoso" });
    },
};
