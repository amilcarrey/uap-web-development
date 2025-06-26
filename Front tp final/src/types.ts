export interface Reminder {
  id: number;
  name: string;
  completed: boolean;
  board_id: string; // Asegúrate de que Reminder tenga este campo si lo necesitas
}

export interface Board {
  id: string; 
  name: string;
}