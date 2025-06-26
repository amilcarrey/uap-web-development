import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Board } from "../entities/Board";
import { Task } from "../entities/Task";
import { BoardUser } from "../entities/BoardUser";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // Para desarrollo, en producción usar migraciones
  logging: false,
  entities: [User, Board, Task, BoardUser],
  migrations: [],
  subscribers: [],
});
