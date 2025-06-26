import { Router } from "express";
import {
  getAllTableros,
  getTableroById,
  createTablero,
  deleteTablero,
} from "../modules/tableros/tableros.controller";
import { authenticate } from "../middleware/auth.middleware";

export const tableroRoutes = Router();

tableroRoutes.use(authenticate);


tableroRoutes.get("/", getAllTableros);


tableroRoutes.get("/:id", getTableroById);


tableroRoutes.post("/", createTablero);
// DELETE /api/tableros/:id
tableroRoutes.delete("/:id", deleteTablero);
