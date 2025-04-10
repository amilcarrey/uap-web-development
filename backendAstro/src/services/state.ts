// src/services/state.ts

export interface Task {
  texto: string;
  completada: boolean;
}

interface State {
  tasks: Task[];
}

export const state: State = {
  tasks: [
    { texto: "Comprar pan", completada: false },
    { texto: "Estudiar análisis matemático", completada: false },
  ],
};
