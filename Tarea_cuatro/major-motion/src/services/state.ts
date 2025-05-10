export type Task = {
    id: string;
    name: string;
    completed: boolean;
  };
  
  export const state: {
    tasks: Task[];
  } = {
    tasks: []
  };
  