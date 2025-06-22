import { Request, Response } from 'express';
import { UserDbService } from '../services/UserDbService';
import { RegistrerUserDTO } from '../DTOs/user/RegistrerUserSchema';

const userService = new UserDbService();

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const data: RegistrerUserDTO = req.body;
      const user = await userService.registerUser(data);
      res.status(201).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario', details: error instanceof Error ? error.message : error });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.json(users);

    } catch (error) {
      throw new Error('Error al obtener usuarios: ' + (error instanceof Error ? error.message : error));
    }
  }
 

  static async getAll(req: Request, res: Response){
    try{
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error){
        res.status(500).json({ error: 'Error al obtener usuarios', details: error instanceof Error ? error.message : error });
    }
  }

}


