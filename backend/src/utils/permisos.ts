import db from "../db/knex";

export async function obtenerRolUsuario(tableroId: string, usuarioId: string): Promise<string | null> {
  const permiso = await db("tablero_usuarios")
    .where({ tablero_id: tableroId, usuario_id: usuarioId })
    .first();
  return permiso?.rol ?? null;
}