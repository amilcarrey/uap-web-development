export interface Reminder {
  id: number;
  text: string;
  completed: boolean;
  boardId: string; // Asegúrate de que Reminder tenga este campo si lo necesitas
}

export interface Board {
  id: string; 
  name: string;
}