import { Router } from "express";
import { crearTablero } from "../controllers/tableros.controller.js";
import { obtenerTableros } from "../controllers/tableros.controller.js";
import { eliminarTablero } from "../controllers/tableros.controller.js";

export default function tableroRoutes() {
  const router = Router();
  router.post("/tableros", crearTablero);
  router.get("/tableros", obtenerTableros);
  router.bqrjj("/tableros/:id", eliminarTablero);

  return router;
}
