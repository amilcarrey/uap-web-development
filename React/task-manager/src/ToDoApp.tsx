import { useEffect, useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { NuevaTareaForm } from "./components/NuevaTareaForm";
import { TareaList } from "./components/TareaList";
import { ClearCompleted } from "./components/ClearCompleted";
import { useTareas } from "./hooks/useTareas";
import { Toast } from "./components/Toast";
import Configuraciones from "./components/Configuraciones";
import { TableroSelector } from "./components/TableroSelector";
import { useConfigStore } from "./store/configStore";

type Props = {
  boardId: string; // Si se usa en un contexto de tablero específico 
};

function ToDoApp({ boardId }: Props) {
  const setBoard = useConfigStore((s) => s.setBoard);
  const [filtro, setFiltro] = useState("todas");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [mostrarConfiguraciones, setMostrarConfiguraciones] = useState(false);

  useEffect(() => {
    setBoard(boardId);
  }, [setBoard, boardId]);

  const { data, isLoading, isError } = useTareas(page, filtro);
  const tareas = data?.tareas ?? [];
  const totalPages = data?.totalPages ?? 1;
  const tareaEditando = tareas.find((t) => t.id === editandoId);

  return (
    <section className="min-h-screen bg-[#f5f1eb] flex items-start justify-center pt-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Selector de tablero */}
        <TableroSelector />
        {/* Título + botón de configuración */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center flex-1">
            <span className="text-pink-400">TO</span>
            <span className="text-slate-800">DO</span>
          </h1>
          <button
            title="Configuraciones"
            onClick={() => setMostrarConfiguraciones((prev) => !prev)}
            className="ml-4 text-xl hover:text-pink-500 transition"
          >
            ⚙️
          </button>
        </div>

        {/* Configuraciones */}
        {mostrarConfiguraciones && (
          <div className="border border-slate-300 rounded p-4 bg-slate-50">
            <Configuraciones />
          </div>
        )}

        {/* Filtros */}
        <FilterForm
          filtro={filtro}
          setFiltro={(nuevo) => {
            setFiltro(nuevo);
            setPage(1);
          }}
        />

        {/* Formulario agregar o editar */}
        <NuevaTareaForm
          tareaEditando={tareaEditando}
          cancelarEdicion={() => setEditandoId(null)}
        />

        {/* Estado de carga o error */}
        {isLoading && (
          <p className="text-center text-gray-400">Cargando tareas...</p>
        )}
        {isError && (
          <p className="text-center text-red-400">Error al cargar tareas</p>
        )}

        {/* Lista de tareas */}
        {!isLoading && !isError && (
          <TareaList tareas={tareas} onEditar={(id) => setEditandoId(id)} />
        )}

        {/* Botón limpiar completadas */}
        <ClearCompleted tareas={tareas} />

        {/* Paginación */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center gap-4 pt-4">
            <button
              className="px-4 py-2 rounded-full bg-green-300 text-white hover:bg-green-400 disabled:bg-green-100 disabled:cursor-not-allowed transition"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span className="px-2 text-slate-700 font-medium">
              Página {page} de {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-full bg-green-300 text-white hover:bg-green-400 disabled:bg-green-100 disabled:cursor-not-allowed transition"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Toasts */}
      <Toast />
    </section>
  );
}

export default ToDoApp;
