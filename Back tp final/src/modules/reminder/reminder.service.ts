import { Board, CreateReminderRequest, Reminder } from "../../types";
import { ReminderRepository } from "./reminder.repository";

export class ReminderService {
  constructor(private readonly reminderRepository: ReminderRepository) {}

  async getAllRemindersByBoardId(board_id: string): Promise<Reminder[]> {
    return this.reminderRepository.getAllRemindersByBoardId(board_id);
  }

  async getReminderById(id: string): Promise<Reminder | undefined> {
    return this.reminderRepository.getReminderById(id);
  }

  async createReminder(reminderData: CreateReminderRequest, userId: string): Promise<Reminder> {
    const reminderRequest = { ...reminderData, created_by: userId };
    return this.reminderRepository.createReminder(reminderRequest);
  }

  async deleteReminder(id: string): Promise<boolean> {
    return this.reminderRepository.deleteReminder(id);
  }
  async toggleReminder(id: string): Promise<void> {
    if (!id) throw new Error('ID de reminder requerido');
    await this.reminderRepository.toggleReminder(id);
  }

  async deleteCompletedTasks(board_Id: string, user_id: string) { //lo de user id es para verificar que el usuario tenga acceso al board, tengo que hacerlo
  //await this.verifyBoardAccess(boardId, userId, 'full_access'); A IMPLEMENTARRRRR
  return this.reminderRepository.deleteByBoardAndStatus(board_Id, true);
}

async editReminder(id: string, updatedData: Partial<CreateReminderRequest>): Promise<Reminder | undefined> {
    if (!id) throw new Error('ID de reminder requerido');
    return this.reminderRepository.editReminder(id, updatedData);
  }

  async getRemindersPaginated(board_id: string, limit: number, offset: number) {
  return this.reminderRepository.getPaginatedReminders(board_id, limit, offset);
}

async countRemindersByBoard(board_id: string) {
  return this.reminderRepository.countByBoard(board_id);
}

}