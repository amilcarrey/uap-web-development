import { Pool } from "pg";
import {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} from "../config.js";

export const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: String(DB_PASSWORD),
  port: Number(DB_PORT),
});

export default pool;
