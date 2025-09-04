import { Request, Response } from 'express';
import { UserDbService } from '../services/UserDbService';
import { RegistrerUserDTO, RegistrerUserSchema } from '../DTOs/user/RegistrerUserSchema';

const userService = new UserDbService();

export class UserController {
  
  
  static async getProfile(req: Request, res: Response) {
    const currentUser = (req as any).user;
    
    if (!currentUser) {
      const error = new Error("Usuario no autenticado");
      (error as any).status = 401;
      throw error;
    }

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
      lastName: userDetails.lastName,
      settings: userDetails.settings
    });
  }

  
  static async updateProfile(req: Request, res: Response) {
    const currentUser = (req as any).user;
    
    if (!currentUser) {
      const error = new Error("Usuario no autenticado");
      (error as any).status = 401;
      throw error;
    }

    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      const error = new Error("Nombre y apellido son requeridos");
      (error as any).status = 400;
      throw error;
    }

    try {
      const updatedUser = await userService.updateUserProfile(currentUser.id, {
        firstName,
        lastName
      });

      res.json({
        id: currentUser.id,
        alias: updatedUser.alias,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      });
    } catch (error: any) {
      const err = new Error("Error al actualizar el perfil");
      (err as any).status = 500;
      throw err;
    }
  }

  
  static async searchUsers(req: Request, res: Response) {
    const currentUser = (req as any).user;
    
    if (!currentUser) {
      const error = new Error("Usuario no autenticado");
      (error as any).status = 401;
      throw error;
    }

    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      const error = new Error("La consulta debe tener al menos 2 caracteres");
      (error as any).status = 400;
      throw error;
    }

    try {
      const users = await userService.searchUsersByAlias(query);
      
      
      const filteredUsers = users.filter(user => user.alias !== currentUser.alias);
      
      res.json(filteredUsers.map((user: any) => ({
        id: user.id,              
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName
      })));
    } catch (error: any) {
      const err = new Error("Error al buscar usuarios");
      (err as any).status = 500;
      throw err;
    }
  }

  
  static async register(req: Request, res: Response) {
    
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

  
  static async getAllUsers(req: Request, res: Response) {
    const currentUser = (req as any).user;
    
    if (!currentUser || !currentUser.id) {
      const error = new Error("Usuario no válido");
      (error as any).status = 400;
      (error as any).message = "No se pudo identificar al usuario actual";
      throw error;
    }

    try {
      
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100); 
      const offset = parseInt(req.query.offset as string) || 0;

      const allUsers = await userService.getAllUsersExcludingCurrent(
        currentUser.id, 
        limit, 
        offset
      );

      
      

      
      res.json({
        users: allUsers.users.map((user: any) => ({
          id: user.id,
          alias: user.alias,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt || new Date().toISOString()
        })),
        total: allUsers.total,
        currentUser: {
          id: currentUser.id,
          alias: currentUser.alias
        },
        pagination: {
          limit: limit,
          offset: offset
        }
      });

    } catch (error: any) {
      console.error('❌ Error al obtener usuarios:', error);
      const err = new Error("Error interno del servidor");
      (err as any).status = 500;
      (err as any).message = "No se pudo obtener la lista de usuarios";
      (err as any).details = process.env.NODE_ENV === 'development' ? error.message : undefined;
      throw err;
    }
  }
}
