export interface UserConfigDto {
  intervalo_refetch: number;
  tareas_por_pagina: number;
  descripcion_mayusculas: boolean;
  tarea_bg_color?: string;
  fondo_actual?: string; // <-- Añade esto
}