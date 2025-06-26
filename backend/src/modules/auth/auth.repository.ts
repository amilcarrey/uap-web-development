import db from "../../db/knex";
import { v4 as uuidv4 } from "uuid";
import { CreateUserRequest } from "./auth.dto";

export class AuthRepository {
  async getUserByEmail(email: string) {
    return db("users").where({ email }).first();
  }

  async getUserByNombre(nombre: string) {
    return db("users").where({ nombre }).first();
  }

  async createUser(userData: CreateUserRequest, passwordHash: string) {
    const [user] = await db("users")
      .insert({
        id: uuidv4(),
        nombre: userData.nombre,
        email: userData.email,
        password: passwordHash,
        role: userData.role || "user",
      })
      .returning("*");
    return user;
  }
}