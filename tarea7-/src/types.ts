export type Tarea = {
    id: string;
    content: string;
    checked: boolean;
    idTablero: string; 
  };

export type Notificacion = {
    id: string;
    content: string;
  };

export type Configuracion = 
{
    intervaloRefetch: number;
    capsLck: boolean;
}

export type Tablero = 
{
  id: string;
  nombre: string;
  tareas: Tarea[];
}