// server/routes/configuracion.routes.js
import { Router } from "express";
import autenticarJWT from "../middlewares/auth.js";
import {
  obtenerConfiguracion,
  actualizarConfiguracion
} from "../controllers/configuracion.controller.js";

const router = Router();

// Todas las rutas de configuración requieren JWT
router.use(autenticarJWT);

// GET  /api/configuracion
router.get("/", obtenerConfiguracion);

// PUT  /api/configuracion
router.put("/", actualizarConfiguracion);

export default () => router;
