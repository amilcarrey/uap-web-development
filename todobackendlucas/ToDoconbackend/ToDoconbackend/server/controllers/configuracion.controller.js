// server/controllers/configuracion.controller.js
import {
  obtenerConfiguracionService,
  actualizarConfiguracionService
} from "../servieces/configuracionServieces.js";

// GET  /api/configuracion
export const obtenerConfiguracion = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const config = await obtenerConfiguracionService(usuario_id);
    res.json(config);
  } catch (err) {
    console.error("Error al obtener configuración:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// PUT  /api/configuracion
export const actualizarConfiguracion = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const datos = req.body; // { auto_refresh_interval, view_mode, ... }
    const config = await actualizarConfiguracionService(usuario_id, datos);
    res.json({ message: "Configuración actualizada", config });
  } catch (err) {
    console.error("Error al actualizar configuración:", err);
    res.status(500).json({ message: "Error interno" });
  }
};
