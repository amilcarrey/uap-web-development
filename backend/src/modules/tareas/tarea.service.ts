import { TareaRepository } from "./tarea.repository";
import { Tarea } from "../../types/index";

const tareaRepository = new TareaRepository();

export const getAllTareas = (tableroId: string) => tareaRepository.getAll(tableroId);
export const getTareaById = (id: string) => tareaRepository.getById(id);
export const createTarea = (texto: string, tableroId: string) => tareaRepository.create(texto, tableroId);
export const updateTarea = (id: string, data: Partial<Tarea>) => tareaRepository.update(id, data);
export const deleteTarea = (id: string) => tareaRepository.delete(id);
export const toggleCompletada = async (id: string) => tareaRepository.toggleCompletada(id);
export const deleteCompletadas = (tableroId: string) => tareaRepository.deleteCompletadas(tableroId);
export const completarTareaPorId = (id: string) => tareaRepository.toggleCompletada(id);
