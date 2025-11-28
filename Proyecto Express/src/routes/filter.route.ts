import { Router } from "express";
import { FilterRepository } from "../modules/filter/filter.repository";
import { FilterService } from "../modules/filter/filter.service";
import { FilterController } from "../modules/filter/filter.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";

const router = Router();
const filterRepository = new FilterRepository();
const filterService = new FilterService(filterRepository);
const filterController = new FilterController(filterService);

router.use(authWithCookiesMiddleware);

router.get("/", filterController.filterTasks);

export { router as filterRoutes };
