/*
------------------------------------------------------------
No se utiliza, solo servia para realizar pruebas
------------------------------------------------------------
*/



import { Request, Response } from 'express';
import { UserDbService } from '../services/UserDbService';
import { RegistrerUserDTO, RegistrerUserSchema } from '../DTOs/user/RegistrerUserSchema';

const userService = new UserDbService();

export class UserController {
  static async register(req: Request, res: Response) {
    // Validar con Zod
    const parseResult = RegistrerUserSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      const error = new Error("Datos inválidos");
      (error as any).status = 400;
      (error as any).details = parseResult.error.errors;
      throw error;
    }

    const data: RegistrerUserDTO = parseResult.data;
    const user = await userService.createUser(data);

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    });
  }

  static async getUsers(req: Request, res: Response) {
    const users = await userService.getUsers();
    res.json(users);
  }

  static async getAll(req: Request, res: Response){
    const users = await userService.getAllUsers();
    res.json(users);
  }
}


