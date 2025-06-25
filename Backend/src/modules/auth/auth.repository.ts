// src/modules/auth/auth.repository.ts
import { User } from "../../types";
import { database } from "../../db/connection";
import { UserResponse } from "./auth.dto";

export class AuthRepository {
  async getAllUsers(): Promise<UserResponse[]> {
    return database.all<UserResponse>("SELECT id, email, name FROM users");
  }

  async getUserById(id: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE id = ?", [id]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  }

  async createUser(user: User): Promise<UserResponse> {
    await database.run(
      "INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
      [user.id, user.email, user.password, user.name]
    );
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }
}