export type Mensaje = {
  id: string;
  content: string;
  likes: number;
};
// types.ts o donde tengas Task
export type Task = {
  id: number;
  text: string;        // título de la tarea
  completed: boolean;
};
