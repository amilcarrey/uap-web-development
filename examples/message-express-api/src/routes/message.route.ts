import { Router } from "express";


const router = Router();
const wallRepository = new WallRepository();
const wallService = new WallService(wallRepository);
const wallController = new WallController(wallService);

router.get("/", wallController.getAllWalls);
router.get("/:id", wallController.getWallById);
router.post("/", wallController.createWall);
router.delete("/:id", wallController.deleteWall);

export { router as wallRoutes };