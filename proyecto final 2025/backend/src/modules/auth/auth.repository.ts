/*
 archivo que es el que interactua directamente con la base
 de datos respecto a los usuarios

 */
import { database } from "../../db/connection";
import { CreateUserRequest } from "./auth.dto";
import { User } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository {
    //obtencion de usuarios basado en el email
  async getUserByEmail(email: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  }

  // obtencion de usuarios basado en el id
  async getUserById(id: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE id = ?", [id]);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const id = uuidv4();

    await database.run(
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
      [id, data.email, data.password]
    );

    const user = await this.getUserById(id);
    if (!user) throw new Error("Error al crear el usuario");
    return user;
  }

  // async deleteUser(id: string): Promise<boolean> {
  //   await database.run("DELETE FROM users WHERE id = ?", [id]);
  //   return true;
  // }

//   async userExists(id: string): Promise<boolean> {
//     const user = await this.getUserById(id);
//     return !!user;
//   }
}