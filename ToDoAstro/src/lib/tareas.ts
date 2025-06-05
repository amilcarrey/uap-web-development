type Tarea = {
  id: number;
  texto: string;
  completada: boolean;
};

export const tableros: Record<string, Tarea[]> = {
  default: [],
};

