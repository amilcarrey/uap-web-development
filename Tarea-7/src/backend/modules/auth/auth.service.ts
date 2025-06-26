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
    const existingUser = await this.authRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(userData.password);

    return this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    return token;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.authRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.authRepository.getUserByEmail(email);
  }
}
