import db from "../../db/knex";

export class UserConfigRepository {
  async getByUserId(userId: string) {
    return db("user_config").where({ user_id: userId }).first();
  }

  async upsert(userId: string, config: { intervalo_refetch: number; tareas_por_pagina: number; descripcion_mayusculas: boolean }) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      await db("user_config").where({ user_id: userId }).update(config);
    } else {
      await db("user_config").insert({ user_id: userId, ...config });
    }
    return this.getByUserId(userId);
  }
}