import { Router } from "express";
import { getTareas, postTarea } from "../controllers/tareasController";

const router = Router();

router.get("/", getTareas);
router.post("/:id", postTarea);

export default router;
