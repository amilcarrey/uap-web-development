import db from "../../db/knex";
import { Tarea } from "../../types/index";
import { v4 as uuidv4 } from "uuid";

export class TareaRepository {
  async getAll(tableroId: string): Promise<Tarea[]> {
    return db<Tarea>("tareas").where({ tableroId }).select("*");
  }

  async getById(id: string): Promise<Tarea | undefined> {
    return db<Tarea>("tareas").where({ id }).first();
  }

  async create(texto: string, tableroId: string): Promise<Tarea> {
    const now = new Date().toISOString();
    const [tarea] = await db<Tarea>("tareas")
      .insert({
        id: uuidv4(),
        texto,
        tableroId,
        completada: false,
        fecha_creacion: now,
        fecha_modificacion: now,
        fecha_realizada: null,
      })
      .returning("*");
    return tarea;
  }

  async update(id: string, data: Partial<Tarea>): Promise<Tarea | undefined> {
    data.fecha_modificacion = new Date().toISOString();
    const [tarea] = await db<Tarea>("tareas").where({ id }).update(data).returning("*");
    return tarea;
  }

  async delete(id: string): Promise<number> {
    return db<Tarea>("tareas").where({ id }).delete();
  }

  async deleteCompletadas(tableroId: string): Promise<number> {
    return db("tareas").where({ tableroId, completada: true }).delete();
  }

  async toggleCompletada(id: string) {
    const tarea = await db("tareas").where({ id }).first();
    if (!tarea) return null;
    const nuevaCompletada = !tarea.completada;
    const fecha_realizada = nuevaCompletada ? new Date().toISOString() : null;
    await db("tareas")
      .where({ id })
      .update({
        completada: nuevaCompletada,
        fecha_modificacion: new Date().toISOString(),
        fecha_realizada,
      });
    return { ...tarea, completada: nuevaCompletada, fecha_realizada };
  }
}
