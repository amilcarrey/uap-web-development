export type Tablero = {
  id: string;
  nombre: string;
  alias: string;
}

export type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
  idTablero: string;
};