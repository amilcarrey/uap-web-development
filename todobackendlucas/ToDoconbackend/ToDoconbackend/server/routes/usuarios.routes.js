import { Router } from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";
import autenticarJWT from "../middlewares/auth.js";
const router = Router();

router.get("/", autenticarJWT, obtenerUsuarios);                   // GET /api/usuarios
router.get("/:id", autenticarJWT, obtenerUsuarioPorId);            // GET /api/usuarios/:id
router.post("/", autenticarJWT, crearUsuario);                     // POST /api/usuarios
router.put("/:id", autenticarJWT, actualizarUsuario);              // PUT /api/usuarios/:id
router.delete("/:id", autenticarJWT, eliminarUsuario);             // DELETE /api/usuarios/:id

export default () => router;
