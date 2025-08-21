import { Request, Response } from "express";
import { FilterService } from "./filter.service";

export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  filterTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extraer userId autenticado
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Se crea una instancia de URL con toda la URL completa del request para poder 
      // acceder fácilmente a los query parameters.
      const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      const filter = url.searchParams.get("filter") ?? "all";
      const activeBoardId = url.searchParams.get("activeBoardId");
      const page = parseInt(url.searchParams.get("page") ?? "1", 10);
      const limit = parseInt(url.searchParams.get("limit") ?? "5", 10);

      if (!activeBoardId) {
        res.status(400).json({ error: "activeBoardId is required" });
        return;
      }

      const result = await this.filterService.filterTasks({
        userId, filter, activeBoardId, page, limit,
      });

      res.json(result);
    } catch (error) {
      console.error("Error getting filtered tasks:", error);
      res.status(500).json({ error: "Failed to retrieve filtered tasks" });
    }
  };
}