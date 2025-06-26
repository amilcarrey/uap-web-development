import { Router } from "express";
import {
  getTareas,
  getTareaPorId,
  createTarea,
  updateTarea,
  deleteTarea,
} from "../modules/tareas/tareas.controller";

export const tareasRoutes = Router();

tareasRoutes.get("/", getTareas);
tareasRoutes.get("/:id", getTareaPorId);
tareasRoutes.post("/", createTarea);
tareasRoutes.put("/:id", updateTarea);
tareasRoutes.delete("/:id", deleteTarea);
