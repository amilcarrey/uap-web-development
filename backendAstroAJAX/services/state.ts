export interface Task {
    id: string;
    texto: string;
    completada: boolean;
  }
  
  interface State {
    tasks: Task[];
  }
  
  export const state: State = {
    tasks: [],
  };
  