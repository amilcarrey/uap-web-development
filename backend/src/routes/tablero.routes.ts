import { Router } from "express";
import { listarTableros, agregarTablero } from "../modules/tableros/tablero.controller";

const router = Router();

router.get("/", listarTableros);
router.post("/", agregarTablero);

export default router;
