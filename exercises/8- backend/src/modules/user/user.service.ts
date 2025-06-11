import {
  User,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../../types";
import { UserRepository } from "./user.repository";
import { AuthUtils } from "../../utils";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<Omit<User, "password_hash">[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(
    id: string
  ): Promise<Omit<User, "password_hash"> | undefined> {
    const user = await this.userRepository.getUserById(id);
    if (!user) return undefined;

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async registerUser(userData: CreateUserRequest): Promise<AuthResponse> {
    // Check if email already exists
    const existingEmail = await this.userRepository.emailExists(userData.email);
    if (existingEmail) {
      throw new Error("Email already registered");
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.usernameExists(
      userData.username
    );
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Hash password
    const password_hash = await AuthUtils.hashPassword(userData.password);

    // Create user
    const user = await this.userRepository.createUser({
      ...userData,
      password_hash,
    });

    // Generate token
    const token = AuthUtils.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.getUserByEmail(loginData.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await AuthUtils.comparePassword(
      loginData.password,
      user.password_hash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = AuthUtils.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async updateUser(
    id: string,
    userData: Partial<
      Omit<User, "id" | "created_at" | "updated_at" | "password_hash">
    >
  ): Promise<Omit<User, "password_hash"> | undefined> {
    const user = await this.userRepository.updateUser(id, userData);
    if (!user) return undefined;

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }

  async userExists(id: string): Promise<boolean> {
    return this.userRepository.userExists(id);
  }
}
