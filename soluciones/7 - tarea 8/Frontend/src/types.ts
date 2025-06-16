export interface Tarea {
  id: number;
  descripcion: string;
  completada: boolean;
  tableroId: string;
}

export interface Tablero {
  id: string;
  nombre: string;
}
