import { Router } from "express";
import autenticarJWT from "../middlewares/auth.js";
import { autorizarRol } from "../middlewares/autorizarRol.js";

import {
  obtenerTableros,
  obtenerTableroPorId,
  crearTablero,
  actualizarTablero,
  eliminarTablero
} from "../controllers/tableros.controller.js";

import {
  listarPermisos,
  compartirTablero,
  cambiarRolPermiso,
  revocarAcceso
} from "../controllers/permiso.controller.js"; // fíjate que es permiso.controller.js

const router = Router();

// — TABLEROS —

// Cualquiera autenticado ve su lista
router.get(
  "/",
  autenticarJWT,
  obtenerTableros
);

// Ver un tablero (cualquier rol)
router.get(
  "/:id",
  autenticarJWT,
  autorizarRol("propietario","editor","lector"),
  obtenerTableroPorId
);

// Crear tablero — cualquier usuario autenticado
router.post(
  "/",
  autenticarJWT,
  crearTablero
);

// Actualizar tablero — solo propietario
router.put(
  "/:id",
  autenticarJWT,
  autorizarRol("propietario"),
  actualizarTablero
);

// Eliminar tablero — solo propietario
router.delete(
  "/:id",
  autenticarJWT,
  autorizarRol("propietario"),
  eliminarTablero
);

// — PERMISOS —

// Listar permisos — cualquier rol
router.get(
  "/:id/permisos",
  autenticarJWT,
  autorizarRol("propietario","editor","lector"),
  listarPermisos
);

// Compartir o actualizar permiso — solo propietario
router.post(
  "/:id/compartir",
  autenticarJWT,
  autorizarRol("propietario"),
  compartirTablero
);

// Cambiar rol — solo propietario
router.put(
  "/:id/usuarios/:uid/rol",
  autenticarJWT,
  autorizarRol("propietario"),
  cambiarRolPermiso
);

// Revocar acceso — solo propietario
router.delete(
  "/:id/usuarios/:uid",
  autenticarJWT,
  autorizarRol("propietario"),
  revocarAcceso
);

export default () => router;
