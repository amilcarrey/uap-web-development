import { MeasureMemoryMode } from "vm";
import { database } from "../../db/connection";
import { Message, CreateMessageRequest, Wall } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class MessageRepository {
  async getAllMessages(): Promise<Message[]> {
    return database.all<Message>("SELECT * FROM messages ORDER BY created_at DESC");
  }

  async getMessageById(id: string): Promise<Message | undefined> {
    return database.get<Message>("SELECT * FROM messages WHERE id = ", [id]);
  }

  async likeMessageById(id: string): Promise<Message | undefined>
  {
    const message = await this.getMessageById(id)
    database.get(` ALTER TABLE messages ALTER COLUMN (likes) values (${message?.likes}) WHERE id = ${id} ` , )
    return 
  }

  async createMessage(messageData: CreateMessageRequest, wall: Wall): Promise<Message> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO messages (id, wall_id, content, likes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [id, messageData.content, wall.id, messageData.content, 0, now, now]
    );

    const message = await this.getMessageById(id);
    if (!message) {
      throw new Error("Failed to create message");
    }

    return message;
  }

  async deleteMessage(id: string): Promise<boolean> {
    await database.run("DELETE FROM Messages WHERE id = ?", [id]);
    return true;
  }


}
