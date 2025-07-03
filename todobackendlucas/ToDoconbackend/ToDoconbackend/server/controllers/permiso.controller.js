// server/controllers/permisos.controller.js
import {
  compartirTableroService,
  cambiarRolPermisoService,
  revocarAccesoService,
  listarPermisosService,
  obtenerRolService
} from "../servieces/permisoServieces.js";

// GET  /api/tableros/:id/permisos
export const listarPermisos = async (req, res) => {
  const tablero_id = Number(req.params.id);
  const usuario_id = req.usuario.id;

  // 1) verificamos que sea propietario
  const rolPropietario = await obtenerRolService(tablero_id, usuario_id);
  if (rolPropietario !== "propietario")
    return res.status(403).json({ message: "Sin acceso a este tablero" });

  // 2) listamos
  const permisos = await listarPermisosService(tablero_id);
  res.json(permisos);
};

// POST /api/tableros/:id/compartir
export const compartirTablero = async (req, res) => {
  const tablero_id = Number(req.params.id);
  const usuarioProp = req.usuario.id;
  const { usuario_id, rol } = req.body;

  // 1) sólo propietario
  const rolPropietario = await obtenerRolService(tablero_id, usuarioProp);
  if (rolPropietario !== "propietario")
    return res.status(403).json({ message: "Sin acceso a este tablero" });

  // 2) compartimos (o actualizamos)
  const permiso = await compartirTableroService(tablero_id, usuario_id, rol);
  res.status(201).json({ message: "Permiso asignado", permiso });
};

// PUT  /api/tableros/:id/compartir
export const cambiarRolPermiso = async (req, res) => {
  const tablero_id = Number(req.params.id);
  const usuarioProp = req.usuario.id;
  const { usuario_id, rol } = req.body;

  // 1) validamos propietario
  const rolPropietario = await obtenerRolService(tablero_id, usuarioProp);
  if (rolPropietario !== "propietario")
    return res.status(403).json({ message: "Sin acceso a este tablero" });

  // 2) actualizamos rol
  const permiso = await cambiarRolPermisoService(tablero_id, usuario_id, rol);
  if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });

  res.json({ message: "Rol actualizado", permiso });
};

// DELETE /api/tableros/:id/compartir
export const revocarAcceso = async (req, res) => {
  const tablero_id = Number(req.params.id);
  const usuarioProp = req.usuario.id;
  const { usuario_id } = req.body;

  // 1) validamos propietario
  const rolPropietario = await obtenerRolService(tablero_id, usuarioProp);
  if (rolPropietario !== "propietario")
    return res.status(403).json({ message: "Sin acceso a este tablero" });

  // 2) borramos permiso
  const ok = await revocarAccesoService(tablero_id, usuario_id);
  if (!ok) return res.status(404).json({ message: "Permiso no encontrado" });

  res.json({ message: "Acceso revocado" });
};
