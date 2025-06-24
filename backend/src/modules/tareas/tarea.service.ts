import db from "../../db/knex";
import { Tarea } from "../../types/index";
import { v4 as uuidv4 } from "uuid";

// Obtener todas las tareas
export const getAllTareas = async (): Promise<Tarea[]> => {
  return await db<Tarea>("tareas").select("*");
};

// Obtener una tarea por ID
export const getTareaById = async (id: string): Promise<Tarea | undefined> => {
  return await db<Tarea>("tareas").where({ id }).first();
};

// Crear una nueva tarea
export const createTarea = async (
  texto: string,
  tableroId?: string
): Promise<Tarea> => {
  const now = new Date().toISOString();
  const tarea: Tarea = {
    id: uuidv4(),
    texto,
    completada: false,
    fecha_creacion: now,
    fecha_modificacion: now,
    fecha_realizada: null,
    tableroId,
  };

  const [nuevaTarea] = await db<Tarea>("tareas").insert(tarea).returning("*");
  return nuevaTarea;
};

// Actualizar una tarea
export const updateTarea = async (
  id: string,
  data: Partial<Tarea>
): Promise<Tarea | undefined> => {
  data.fecha_modificacion = new Date().toISOString(); // Siempre actualizamos la fecha de modificación

  const [actualizada] = await db<Tarea>("tareas")
    .where({ id })
    .update(data)
    .returning("*");

  return actualizada;
};

// Eliminar una tarea
export const deleteTarea = async (id: string): Promise<number> => {
  return await db<Tarea>("tareas").where({ id }).delete();
};
