import { Router } from "express";
import autenticarJWT from "../middlewares/auth.js";
import { autorizarRol } from "../middlewares/autorizarRol.js";
import {
  compartirTablero,
  cambiarRolPermiso,
  revocarAcceso,
  listarPermisos
} from "../controllers/permiso.controller.js";

const router = Router();

// Sólo PROPIETARIO puede asignar o cambiar roles
router.post(
  "/:id/compartir",
  autenticarJWT,
  autorizarRol("propietario"),
  compartirTablero
);

router.put(
  "/:id/usuarios/:uid/rol",
  autenticarJWT,
  autorizarRol("propietario"),
  cambiarRolPermiso
);

// **Fíjate bien aquí**: la cadena SIEMPRE entre comillas dobles o simples,
// y el patrón completo dentro de ellas.
router.delete(
  "/:id/usuarios/:uid",
  autenticarJWT,
  autorizarRol("propietario"),
  revocarAcceso
);

// Cualquier rol con acceso puede listar permisos
router.get(
  "/:id/usuarios",
  autenticarJWT,
  autorizarRol("propietario", "editor", "lector"),
  listarPermisos
);

export default () => router;
