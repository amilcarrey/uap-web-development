export interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  fecha_realizada?: string | null;
  tableroId?: string;
}


export interface Tablero {
  id: string;
  nombre: string;
}
