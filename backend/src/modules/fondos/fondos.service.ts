import * as fondosRepo from "./fondos.repository";

export const obtenerFondos = async (userId: string) => {
  return fondosRepo.getFondosByUser(userId);
};

export const agregarFondo = async (userId: string, url: string) => {
  return fondosRepo.addFondo(userId, url);
};

export const eliminarFondo = async (userId: string, fondoId: string) => {
  return fondosRepo.deleteFondo(userId, fondoId);
};