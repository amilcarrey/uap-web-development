import { User } from "../../types";
import { CreateUserRequest, UserResponse } from "./auth.dto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async getAllUsers(): Promise<UserResponse[]> {
    return this.authRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.authRepository.getUserById(id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.authRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con este correo electrónico");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name
    };

    return this.authRepository.createUser(newUser);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    return token;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.authRepository.getUserByEmail(email);
}
}