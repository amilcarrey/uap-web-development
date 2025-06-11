import { Router } from "express";
import { FilterController } from "../modules/filter/filter.controller";

const router = Router();
const filterController = new FilterController();

// Filter routes
router.get("/", filterController.getFilter.bind(filterController));
router.put("/", filterController.setFilter.bind(filterController));

export default router;
