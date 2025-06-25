import { UserConfigRepository } from "./user_config.repository";

const userConfigRepository = new UserConfigRepository();

export const getUserConfig = (userId: string) => userConfigRepository.getByUserId(userId);

export const upsertUserConfig = (userId: string, config: { intervalo_refetch: number; tareas_por_pagina: number; descripcion_mayusculas: boolean }) =>
  userConfigRepository.upsert(userId, config);