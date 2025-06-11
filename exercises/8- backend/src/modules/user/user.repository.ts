import { database } from "../../db/connection";
import { User, CreateUserRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  async getAllUsers(): Promise<Omit<User, "password_hash">[]> {
    return database.all<Omit<User, "password_hash">>(
      "SELECT id, username, email, created_at, updated_at FROM users ORDER BY created_at DESC"
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE id = ?", [id]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
  }

  async createUser(
    userData: CreateUserRequest & { password_hash: string }
  ): Promise<User> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, userData.username, userData.email, userData.password_hash, now, now]
    );

    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }

  async updateUser(
    id: string,
    userData: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ): Promise<User | undefined> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.username !== undefined) {
      fields.push("username = ?");
      values.push(userData.username);
    }

    if (userData.email !== undefined) {
      fields.push("email = ?");
      values.push(userData.email);
    }

    if (userData.password_hash !== undefined) {
      fields.push("password_hash = ?");
      values.push(userData.password_hash);
    }

    if (fields.length === 0) {
      return this.getUserById(id);
    }

    fields.push("updated_at = ?");
    values.push(now, id);

    await database.run(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    await database.run("DELETE FROM users WHERE id = ?", [id]);
    return true;
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    return !!user;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return !!user;
  }
}
