import { User } from "../../types";
import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const existingUser = await this.authRepository.getUserByName(
      userData.name
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const password = userData.password;
    const hashedPassword = await hash(password);

    return this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(username: string, password: string): Promise<string> {
    console.log("Login attempt for user:", username);
    const user = await this.authRepository.getUserByName(username);
    console.log("User found:", user);
    if (!user) {
      throw new Error("User not found");
    }
    //console.log("Password hash from DB:", user.password_hash);
    if (!user.password_hash) {
      throw new Error("Password hash not found for user");
    }

    const isPasswordValid = await verify(user.password_hash, password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, name: user.username }, "secret");
    //console.log("Generated token:", token);
    return token;
  }
}
