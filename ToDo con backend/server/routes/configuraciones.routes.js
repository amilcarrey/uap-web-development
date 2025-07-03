import {
  guardarConfiguracionUsuario,
  obtenerConfiguracionUsuario,
} from "../servieces/configuracionServiece.js";

import { authMiddleware } from "../middlewares/auth.js";
import { Router } from "express";

export default function configuracionRoutes() {
  const router = Router();

  router.post("/configuracion", authMiddleware, async (req, res) => {
    await guardarConfiguracionUsuario(req.user.id, req.body.preferencia);
    res.json({ message: "Configuración guardada" });
  });
  router.get("/configuracion", authMiddleware, async (req, res) => {
    const conf = await obtenerConfiguracionUsuario(req.user.id);
    res.json({ configuracion: conf });
  });
}
