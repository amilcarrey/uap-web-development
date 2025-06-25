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
import { ClipboardList } from 'lucide-react';

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
  // filtro y página fijos por ahora
  const filtro = 'todas';
  const pagina = 1;

  // traigo info del tablero
  const { data: tablero, isLoading: cargandoTablero, isError: errorTablero } = useTablero(tableroId);

  // traigo tareas y mutaciones
  const { data, isLoading, isError } = useTareas(filtro, pagina, tableroId);
  const agregar = useAgregarTarea(filtro, pagina, tableroId);
  const borrar = useBorrarTarea(filtro, pagina, tableroId);
  const editar = useEditarTarea(filtro, pagina, tableroId);
  const toggle = useToggleTarea(filtro, pagina, tableroId);

  // si está cargando el tablero muestro spinner
  if (cargandoTablero) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="animate-spin text-cyan-600 mb-2">
          <ClipboardList size={32} />
        </span>
        <p className="text-gray-600">Cargando tablero...</p>
      </div>
    );
  }
  // si hay error o no existe el tablero
  if (errorTablero || !tablero) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <p className="text-red-600 font-semibold">Error al cargar el tablero</p>
      </div>
    );
  }

  // render principal del tablero
  return (
    <main className="max-w-xl mx-auto p-6 bg-white/90 rounded-xl shadow-lg mt-8">
      {/* título del tablero */}
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList size={26} className="text-cyan-700" />
        <h1 className="text-2xl font-bold text-cyan-800">{tablero.nombre}</h1>
      </div>

      {/* form para agregar tarea */}
      <div className="mb-6">
        <TaskForm onAdd={(texto) => agregar.mutate(texto)} tableroId={tableroId} />
      </div>

      {/* lista de tareas o estados de carga/error */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="animate-spin text-cyan-600">
            <ClipboardList size={24} />
          </span>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      ) : isError ? (
        <p className="text-red-600">Error al cargar tareas</p>
      ) : (
        <TaskList
          tareas={data || []}
          onToggle={(id) => toggle.mutate(id)}
          onDelete={(id) => borrar.mutate(id)}
          onEdit={(id, textoActual) => {
            // prompt para editar tarea
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
