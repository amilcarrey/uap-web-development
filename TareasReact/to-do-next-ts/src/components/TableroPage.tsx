'use client';

import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useTablero } from '@/hooks/useTablero';
import {
  useTareas,
  useAgregarTarea,
  useBorrarTarea,
  useEditarTarea,
  useToggleTarea,
} from '@/hooks/useTareas';

type Props = {
  tableroId: string;
};

type Tarea = {
  id: string;
  texto: string;
  completada: boolean | number;
  tableroId: string;
};

export default function TableroPage({ tableroId }: Props) {
  const filtro = 'todas';
  const pagina = 1;

  const { data: tablero, isLoading: cargandoTablero, isError: errorTablero } = useTablero(tableroId);

  const { data, isLoading, isError } = useTareas(filtro, pagina, tableroId);
  console.log('data de tareas:', data);

  const agregar = useAgregarTarea(filtro, pagina, tableroId);
  const borrar = useBorrarTarea(filtro, pagina, tableroId);
  const editar = useEditarTarea(filtro, pagina, tableroId);
  const toggle = useToggleTarea(filtro, pagina, tableroId);

  if (cargandoTablero) return <p>Cargando tablero...</p>;
  if (errorTablero || !tablero) return <p>Error al cargar el tablero</p>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{tablero.nombre}</h1>

      <TaskForm onAdd={(texto) => agregar.mutate(texto)} tableroId={tableroId} />

      {isLoading ? (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      ) : isError ? (
        <p>Error al cargar tareas</p>
      ) : (
        <TaskList
          tareas={data || []}
          onToggle={(id) => toggle.mutate(id)}
          onDelete={(id) => borrar.mutate(id)}
          onEdit={(id, textoActual) => {
            const nuevoTexto = prompt('Editar tarea:', textoActual);
            if (nuevoTexto && nuevoTexto.trim() && nuevoTexto !== textoActual) {
              editar.mutate({ id, texto: nuevoTexto.trim() });
            }
          }}
        />
      )}
    </main>
  );
}
