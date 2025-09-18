// import { User } from "../../types";
// import { BoardRepository } from "../board/board.repository";
// import { BoardService } from "../board/board.service";
// import { CreateUserRequest } from "./auth.dto";
// import { AuthRepository } from "./auth.repository";
// import { hash, verify } from "argon2";
// import jwt from "jsonwebtoken";

// export class AuthService {
//   constructor(
//     private readonly authRepository: AuthRepository,
//     private readonly boardService: BoardService
//   ) {}

//   async getAllUsers(): Promise<User[]> {
//     return this.authRepository.getAllUsers();
//   }

//   async createUser(userData: CreateUserRequest): Promise<User> {
//     const existingUser = await this.authRepository.getUserByEmail(
//       userData.email
//     );
//     if (existingUser) {
//       throw new Error("User already exists");
//     }

//     const password = userData.password;
//     const hashedPassword = await hash(password);

//     const newUser = await this.authRepository.createUser({
//       ...userData,
//       password: hashedPassword,
//     });

//     console.log("Created user:", newUser.id);
//     const board = await this.boardService.createBoard({ name: "General" });
//     console.log("Created default board for user:", board);

//     if (!board) {
//       throw new Error("Failed to create default board");
//     }

//     await this.boardService.addUserToBoard(newUser.id, board.id, "owner");

//     return newUser;
//   }

//   async login(email: string, password: string): Promise<string> {
//     const user = await this.authRepository.getUserByEmail(email);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const isPasswordValid = await verify(user.password, password);
//     if (!isPasswordValid) {
//       throw new Error("Invalid password");
//     }

//     const token = jwt.sign({ id: user.id, email: user.email }, "secret");

//     return token;
//   }
// }

import { User } from "../../types";
import { BoardRepository } from "../board/board.repository";
import { BoardService } from "../board/board.service";
import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly boardService: BoardService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const existingUser = await this.authRepository.getUserByEmail(
      userData.email
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const password = userData.password;
    const hashedPassword = await hash(password);

    const newUser = await this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const board = await this.boardService.createBoard({ name: "General" }, newUser.id);

    await this.boardService.addUserToBoard(newUser.id, board.id, "owner");

    return newUser;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, "secret");

    return token;
  }
}