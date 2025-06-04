'use client';

import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import {
  useTareas,
  useAgregarTarea,
  useBorrarTarea,
  useEditarTarea,
  useToggleTarea,
} from '@/hooks/useTareas';

type Props = {
  tablero: {
    id: string;
    nombre: string;
  };
};

export default function TableroPage({ tablero }: Props) {
  const filtro = 'todas';
  const pagina = 1;

  const { data, isLoading, isError } = useTareas(filtro, pagina, tablero.id);
  const agregar = useAgregarTarea(filtro, pagina, tablero.id);
  const borrar = useBorrarTarea(filtro, pagina, tablero.id);
  const editar = useEditarTarea(filtro, pagina, tablero.id);
  const toggle = useToggleTarea(filtro, pagina, tablero.id);

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{tablero.nombre}</h1>

      <TaskForm onAdd={(texto) => agregar.mutate(texto)} tableroId={tablero.id} />

      {isLoading ? (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      ) : isError ? (
        <p>Error al cargar tareas</p>
      ) : (
        <TaskList
          tareas={data?.tareas || []}
          onToggle={(id) => toggle.mutate(id)}
          onDelete={(id) => borrar.mutate(id)}
          onEdit={(id, texto) => editar.mutate({ id, texto })}
        />
      )}
    </main>
  );
}
