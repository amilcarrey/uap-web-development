import { TableroRepository } from "./tablero.repository";
import { Tablero } from "../../types/index";

const tableroRepository = new TableroRepository();

export const getAllTableros = () => tableroRepository.getAll();
export const getTableroById = (id: string) => tableroRepository.getById(id);
export const createTablero = (nombre: string, userId: string) =>
  tableroRepository.create(nombre, userId);
export const updateTablero = (id: string, data: Partial<Tablero>) => tableroRepository.update(id, data);
export const deleteTablero = (id: string) => tableroRepository.delete(id);
export const getTablerosByUser = (userId: string) => tableroRepository.getTablerosByUser(userId);
export const compartirTablero = (tableroId: string, usuarioId: string, rol: string) =>
  tableroRepository.compartir(tableroId, usuarioId, rol);

export const obtenerUsuariosCompartidos = (tableroId: string) =>
  tableroRepository.obtenerUsuariosCompartidos(tableroId);

export async function actualizarTotalesTablero(tableroId: string) {
  const totales = await tableroRepository.countTareas(tableroId);
  await tableroRepository.updateTotales(tableroId, totales);
}

export const eliminarColaborador = (tableroId: string, usuarioId: string) =>
  tableroRepository.eliminarColaborador(tableroId, usuarioId);