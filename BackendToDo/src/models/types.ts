export type Tablero = {
  id: string;
  nombre: string;
  alias: string;
  propietarioId?: string;
  publico?: boolean;
}

export type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
  idTablero: string;
};

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  password: string;
};

export type AccesoTablero = {
  id: string; 
  idTablero: string;
  idUsuario: string;
  rol: 'propietario' | 'editor' | 'lector';
};