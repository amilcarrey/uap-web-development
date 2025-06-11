import { Request, Response } from "express";

// Global filter state (in a real app, this would be stored per user in database)
let globalFilter = "all";

export class FilterController {
  async getFilter(_req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: { filter: globalFilter },
      });
    } catch (error) {
      console.error("FilterController.getFilter error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async setFilter(req: Request, res: Response): Promise<void> {
    try {
      const { filter } = req.body;

      const validFilters = ["all", "complete", "incomplete"];

      if (!filter || !validFilters.includes(filter)) {
        res.status(400).json({
          success: false,
          message: "Invalid filter. Must be 'all', 'complete', or 'incomplete'",
        });
        return;
      }

      globalFilter = filter;

      res.status(200).json({
        success: true,
        data: { filter: globalFilter },
      });
    } catch (error) {
      console.error("FilterController.setFilter error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
