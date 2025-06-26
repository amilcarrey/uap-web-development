import { TareasRepository } from "../tareas/tareas.repository";
import { CreateTareaRequest, UpdateTareaRequest } from "../../types";

export class TareasService {
  static getAll(tableroId: string) {
    return TareasRepository.getAll(tableroId);
  }

  static getById(id: number) {
    return TareasRepository.getById(id);
  }

  static create(tarea: CreateTareaRequest) {
    return TareasRepository.create(tarea);
  }

  static update(tarea: UpdateTareaRequest) {
    return TareasRepository.update(tarea);
  }

  static delete(id: number) {
    return TareasRepository.delete(id);
  }

  static getPaginated(tableroId: string, limit: number, offset: number) {
  return TareasRepository.getPaginated(tableroId, limit, offset);
  }

  static getCount(tableroId: string) {
  return TareasRepository.getCount(tableroId);
  }

}
