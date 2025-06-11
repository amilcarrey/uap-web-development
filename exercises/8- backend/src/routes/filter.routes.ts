import { Router } from "express";
import { FilterController } from "../modules/filter/filter.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const filterController = new FilterController();

// All filter routes require authentication
router.use(authenticateToken);

// Filter routes
router.get("/", filterController.getFilter.bind(filterController));
router.put("/", filterController.setFilter.bind(filterController));

export default router;
