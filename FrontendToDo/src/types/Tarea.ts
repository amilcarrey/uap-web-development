export type TareaType = {
  id: number;
  descripcion: string;
  completada: boolean;
};

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

export interface Configuraciones {
  intervaloRefetch: number;
  descripcionMayusculas: boolean;
  tareasPorPagina: number;
}