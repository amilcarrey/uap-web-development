import db from "../../db/knex";
import { Tablero } from "../../types/index";
import { v4 as uuidv4 } from "uuid";

export class TableroRepository {
  async getAll(): Promise<Tablero[]> {
    return db<Tablero>("tableros").select("*");
  }

  async getById(id: string): Promise<Tablero | undefined> {
    return db<Tablero>("tableros").where({ id }).first();
  }

  async create(nombre: string, userId: string): Promise<Tablero> {
    const [tablero] = await db("tableros")
      .insert({ id: uuidv4(), nombre, userId })
      .returning("*");
    // Al crear un tablero:
    await db("tablero_usuarios").insert({
      id: uuidv4(),
      tablero_id: tablero.id,
      usuario_id: userId,
      rol: "propietario",
    });
    return tablero;
  }

  async update(id: string, data: Partial<Tablero>): Promise<Tablero | undefined> {
    const [tablero] = await db<Tablero>("tableros").where({ id }).update(data).returning("*");
    return tablero;
  }

  async delete(id: string): Promise<number> {
    // Borra primero las tareas asociadas (por si no funciona el CASCADE)
    await db("tareas").where({ tableroId: id }).delete();
    return db<Tablero>("tableros").where({ id }).delete();
  }

  async compartir(tableroId: string, usuarioId: string, rol: string) {
    // Evita duplicados
    const existente = await db("tablero_usuarios")
      .where({ tablero_id: tableroId, usuario_id: usuarioId })
      .first();
    if (existente) {
      await db("tablero_usuarios")
        .where({ tablero_id: tableroId, usuario_id: usuarioId })
        .update({ rol });
      return;
    }
    await db("tablero_usuarios").insert({
      id: uuidv4(),
      tablero_id: tableroId,
      usuario_id: usuarioId,
      rol,
    });
  }

  async obtenerUsuariosCompartidos(tableroId: string) {
    return db("tablero_usuarios")
      .join("users", "tablero_usuarios.usuario_id", "users.id")
      .where({ tablero_id: tableroId })
      .select("users.nombre", "tablero_usuarios.rol");
  }

  async getTablerosByUser(userId: string) {
    return db("tableros")
      .join("tablero_usuarios", "tableros.id", "tablero_usuarios.tablero_id")
      .join("users as propietario", "tableros.userId", "propietario.id")
      .where("tablero_usuarios.usuario_id", userId)
      .select(
        "tableros.*",
        "tablero_usuarios.rol",
        "propietario.nombre as propietario" // <-- nombre del propietario
      );
  }

  async countTareas(tableroId: string) {
    const total = await db("tareas").where({ tableroId }).count<{ count: number }>("id as count").first();
    const completadas = await db("tareas").where({ tableroId, completada: true }).count<{ count: number }>("id as count").first();
    const activas = await db("tareas").where({ tableroId, completada: false }).count<{ count: number }>("id as count").first();
    return {
      total: total?.count ?? 0,
      completadas: completadas?.count ?? 0,
      activas: activas?.count ?? 0,
    };
  }

  async updateTotales(tableroId: string, totales: { total: number; completadas: number; activas: number }) {
    await db("tableros")
      .where({ id: tableroId })
      .update({
        total_tareas: totales.total,
        total_activas: totales.activas,
        total_completadas: totales.completadas,
      });
  }

  async eliminarColaborador(tableroId: string, usuarioId: string) {
    // No permitas que el propietario se elimine a sí mismo
    const colaborador = await db("tablero_usuarios")
      .where({ tablero_id: tableroId, usuario_id: usuarioId })
      .first();
    if (colaborador && colaborador.rol === "propietario") {
      throw new Error("No puedes eliminar al propietario del tablero");
    }
    await db("tablero_usuarios")
      .where({ tablero_id: tableroId, usuario_id: usuarioId })
      .delete();
  }

}