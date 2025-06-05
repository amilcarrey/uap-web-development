export interface Tarea {
  id: string;
  text: string;
  completada: boolean;
  tablero: string; // 'personal' o 'profesional'
}

export const state = {
  tareas: [
    {
      id: '1',
      text: 'Estudiar TypeScript',
      completada: false,
      tablero: 'personal'
    },
    {
      id: '2',
      text: 'Comprar pan',
      completada: false,
      tablero: 'personal'
    },
    {
      id: '3',
      text: 'Hacer ejercicio',
      completada: false,
      tablero: 'personal'
    },
    {
      id: '4',
      text: 'Leer un libro',
      completada: false,
      tablero: 'personal'
    },
    {
      id: '5',
      text: 'Hacer tarea',
      completada: false,
      tablero: 'personal'
    },
    {
      id: '6',
      text: 'programar',
      completada: false,
      tablero: 'personal'
    },

    {
      id: '7',
      text: 'Estudiar JavaScript',  
      completada: false,
      tablero: 'profesional'
    },
    {
      id: '8',
      text: 'Revisar correos electrónicos',
      completada: false,
      tablero: 'profesional'
    },
    {
      id: '9',
      text: 'Asistir a reunión de equipo',
      completada: false,
      tablero: 'profesional'
    },
    {
      id: '10',
      text: 'Preparar presentación',
      completada: false,
      tablero: 'profesional'
    },
    {
      id: '11',
      text: 'Enviar informe semanal',
      completada: false,
      tablero: 'universidad',
    }
    




  ] as Tarea[],
  filter: 'all' as 'all' | 'active' | 'completed',
  mode: 'personal' as string, 
};
