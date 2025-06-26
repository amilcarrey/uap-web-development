import {database} from '../../db/connection';
import {Reminder, CreateReminderRequest} from '../../types';
import {v4 as uuidv4} from 'uuid';
import {poolPromise} from '../../db/dbconfig';
import * as sql from 'mssql';

export class ReminderRepository {

  async getAllRemindersByBoardId(board_id:string): Promise<Reminder[]> {
     
    return database.all<Reminder>('SELECT * FROM reminders WHERE board_id = ?',  [board_id]);
  }

  async getReminderById(id: string): Promise<Reminder | undefined> {
    return database.get<Reminder>('SELECT * FROM reminders WHERE id = ?', [id]);
  }

  async createReminder(reminderData: CreateReminderRequest): Promise<Reminder> {
    const id = uuidv4();
    const now = new Date().toISOString();

  await database.run(
  'INSERT INTO reminders (id, name, completed, board_id, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [id, reminderData.name, reminderData.completed, reminderData.board_id, reminderData.created_by, now, now]
);


    const reminder = await this.getReminderById(id);
    if (!reminder) {
      throw new Error('Failed to create reminder');
    }

    return reminder;
  }

  async deleteReminder(id: string): Promise<boolean> {
    await database.run('DELETE FROM reminders WHERE id = ?', [id]);
    return true;
  }

  async reminderExists(id: string): Promise<boolean> {
    const reminder = await this.getReminderById(id);
    return !!reminder;
  }
 
  async toggleReminder(id: string): Promise<void> { // -- IIF es una función de SQL Server: IIF(condición, valor_si_verdadero, valor_si_falso)
    const query = `
      UPDATE dbo.reminders
      SET completed = IIF(completed = 1, 0, 1),
          updated_at = sysutcdatetime()
      WHERE id = ?;
    `;

    await database.run(query, [id]);
  }

  async deleteByBoardAndStatus(board_id: string, completed: boolean) {
  const query = `DELETE FROM reminders WHERE board_id = ? AND completed = ?`;
  return database.run(query, [board_id, completed]);

} 

async editReminder(id: string, updatedData: Partial<CreateReminderRequest>): Promise<Reminder | undefined> {
    if (!id) throw new Error('ID de reminder requerido');

    const now = new Date().toISOString();
    const fields = Object.keys(updatedData).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updatedData);

    const query = `UPDATE reminders SET ${fields}, updated_at = ? WHERE id = ?`;
    await database.run(query, [...values, now, id]);

    return this.getReminderById(id);
  }

  // Método para obtener reminders paginados
async getPaginatedReminders(boardId: string, limit: number, offset: number) {
  const pool   = await poolPromise;          // ⬅️  reutiliza la conexión
  const result = await pool
    .request()
    .input("boardId", sql.VarChar, boardId)
    .input("limit",   sql.Int,     limit)
    .input("offset",  sql.Int,     offset)
    .query(`
      SELECT *
      FROM reminders
      WHERE board_id = @boardId
      ORDER BY created_at DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

  return result.recordset;
}

async countByBoard(boardId: string) {
  const pool   = await poolPromise;
  const result = await pool
    .request()
    .input("boardId", sql.NVarChar(36), boardId)
    .query("SELECT COUNT(*) AS total FROM reminders WHERE board_id = @boardId");

  return result.recordset[0].total as number;
} }