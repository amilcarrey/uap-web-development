import db from "../../db/knex";
import { UserConfigDto } from "./UserConfigDto";

export class UserConfigRepository {
  async getByUserId(userId: string) {
    return db("user_config").where({ user_id: userId }).first();
  }

  async upsert(userId: string, config: UserConfigDto) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      await db("user_config").where({ user_id: userId }).update(config);
    } else {
      await db("user_config").insert({ user_id: userId, ...config });
    }
    return this.getByUserId(userId);
  }
}