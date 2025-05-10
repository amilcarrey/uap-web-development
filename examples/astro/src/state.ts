export interface Tarea {
    id: string;
    text: string;
    completada: boolean;
    mode: string;
  }

export const state = {
  tareas: [] as Tarea[ ],
  filter: 'all' as 'all' | 'active' | 'completed',
  modo: 'personal'
};