import { Request, Response } from "express";
import { ReminderService } from "./reminder.service";
import { CreateReminderRequest } from "../../types";
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

getAllRemindersByBoardId = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.board_id;
    const page    = parseInt(req.query.page as string)  || 1;
    const limit   = parseInt(req.query.limit as string) || 10;
    const offset  = (page - 1) * limit;
console.log(req.params)
    const reminders = await this.reminderService
      .getRemindersPaginated(boardId, limit, offset);
    const total     = await this.reminderService
      .countRemindersByBoard(boardId);

    res.json({
      reminders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error getting reminders:", err);
    res.status(500).json({ error: "Failed to retrieve reminders" });
  }
};

  getReminderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const reminder = await this.reminderService.getReminderById(id);

      if (!reminder) {
        res.status(404).json({ error: "Reminder not found" });
        return;
      }

      res.json({ reminder });
    } catch (error) {
      console.error("Error getting reminder:", error);
      res.status(500).json({ error: "Failed to retrieve reminder" });
    }
  };

  createReminder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Falta user id" });
        return;
      }

      const reminderData: CreateReminderRequest = req.body;

      if (!reminderData.name || !reminderData.board_id) {
        res.status(400).json({ error: "Name and board_id are required" });
        return;
      }

      const reminder = await this.reminderService.createReminder(reminderData, userId);
      res.status(201).json({ reminder });
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  };

  deleteReminder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.reminderService.deleteReminder(id);

      if (!deleted) {
        res.status(404).json({ error: "Reminder not found" });
        return;
      }

      res.json({ message: "Reminder deleted successfully" });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({error: 'Failed to delete reminder'});
    }
  };
  toggleReminder = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.reminderService.toggleReminder(id);
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al alternar reminder:', error);
      res.status(500).json({ message: 'Error al alternar el estado del reminder' });
    }  };


//ESTA TODAVIA NO ESTA PROBADDAAAAAA
  deleteCompletedTasks = async (req: Request, res: Response) => {
  try {
    const { board_id } = req.params;
    const user_id = req.user?.id;
    console.log("Board ID:", board_id);
    if (!user_id) {
      res.status(401).json({ error: "Falta el user Id" });
      return;
    }
    
    await this.reminderService.deleteCompletedTasks(board_id, user_id);
    res.status(204).end();
  } catch (error) {

    res.status(500).json({ error: 'Error eliminando tareas completadas' });
  }
};

  editReminder = async (req: Request, res: Response): Promise<void> => {
    try {
   
      const { id } = req.params;
      const updatedData = req.body;
   console.log("Campos recibidos:", updatedData);
      if (!id) {
        res.status(400).json({ error: "ID de reminder requerido" });
        return;
      }

      const updatedReminder = await this.reminderService.editReminder(id, updatedData);

      if (!updatedReminder) {
        res.status(404).json({ error: "Reminder not found" });
        return;
      }

      res.json({ reminder: updatedReminder });
    } catch (error) {
      console.error("Error editing reminder:", error);
      res.status(500).json({ error: "Failed to edit reminder" });
    }
  };
}