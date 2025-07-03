// server/middlewares/autorizarRol.js
import { obtenerRolService } from "../servieces/permisoServieces.js";

export const autorizarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    // si viene desde /api/tableros/:id → req.params.id
    // si viene desde /api/tableros/:tablero_id/tareas → req.params.tablero_id
    const tablero_id = Number(req.params.tablero_id ?? req.params.id);
    const usuario_id = req.usuario.id;

    const rolActual = await obtenerRolService(tablero_id, usuario_id);
    if (!rolActual) 
      return res.status(403).json({ message: "Sin acceso a este tablero" });

    if (!rolesPermitidos.includes(rolActual))
      return res.status(403).json({ message: "Permiso insuficiente" });

    next();
  };
};
