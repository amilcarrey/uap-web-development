// Tareas.tsx
import api from "../api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useConfiguracion } from "./Configuraciones";
import toast from "react-hot-toast";

export interface Tarea {
  id: string; // Cambio: usar id en lugar de index
  nombre: string;
  tableroId: string;
  completada: boolean;
}

export const useTareas = (tableroId: string, filtro: string = "todos") => {
  const { refetchInterval } = useConfiguracion();
  return useQuery({
    queryKey: ["tareas", tableroId, filtro],
    queryFn: async () => {
      if (!tableroId) return [];
      console.log(
        `🔍 Cargando tareas para tablero ${tableroId} con filtro ${filtro}`
      );

      try {
        const response = await api.get(`/api/tableros/${tableroId}/tareas`, {
          params: { filtro },
        });
        console.log(`✅ Tareas cargadas:`, response.data);
        return response.data.tareas || [];
      } catch (error: any) {
        console.error("❌ Error al cargar tareas:", error);
        if (error.response?.status === 403) {
          throw new Error(
            "No tienes permisos para ver las tareas de este tablero"
          );
        }
        throw error;
      }
    },
    refetchInterval,
    enabled: !!tableroId, // Solo ejecutar si hay tableroId
    retry: 1, // Intentar solo una vez más en caso de error
  });
};

interface ListarTareasProps {
  tableroId: string;
}

export const ListarTareas = ({ tableroId }: ListarTareasProps) => {
  const [filtro, setFiltro] = useState("todos");
  const { descripcionMayusculas } = useConfiguracion();

  const {
    data: tareas = [],
    isLoading,
    error,
    isError,
  } = useTareas(tableroId, filtro);

  // Hook para limpiar tareas completadas
  const limpiarCompletadas = useMutation({
    mutationFn: async () => {
      console.log(`🧹 Limpiando tareas completadas del tablero ${tableroId}`);
      // Por ahora vamos a eliminar una por una las completadas
      const tareasCompletadas = tareas.filter((t: Tarea) => t.completada);
      for (const tarea of tareasCompletadas) {
        await api.delete(`/api/tareas/${tarea.id}`);
      }
    },
    onSuccess: () => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tareas completadas eliminadas");
    },
    onError: (error: any) => {
      console.error("❌ Error al limpiar tareas:", error);
      toast.error("Error al eliminar tareas completadas");
    },
  });

  const handleLimpiarCompletadas = () => {
    const completadas = tareas.filter((t: Tarea) => t.completada).length;
    if (completadas === 0) {
      toast("No hay tareas completadas para eliminar", { icon: "ℹ️" });
      return;
    }

    if (
      confirm(
        `¿Estás seguro de que quieres eliminar las ${completadas} tareas completadas?`
      )
    ) {
      limpiarCompletadas.mutate();
    }
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltro(e.target.value);
    toast.success(`Filtro cambiado a: ${e.target.value}`, {
      duration: 2000,
    });
  };

  // Atajos de teclado - AGREGAR ESTO
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          setFiltro("todos");
          break;
        case "2":
          e.preventDefault();
          setFiltro("pendientes");
          break;
        case "3":
          e.preventDefault();
          setFiltro("completadas");
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          if (completadas > 0) {
            handleLimpiarCompletadas();
          }
          break;
      }
    }
  };

  if (!tableroId) {
    return (
      <div className="text-center text-gray-500 p-8">
        Selecciona un tablero para ver las tareas
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando tareas...</div>;
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar las tareas";
    return (
      <div className="text-center text-red-500 p-4">
        <p>{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!tareas || tareas.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>No hay tareas en este tablero</p>
        <p className="text-sm">¡Crea tu primera tarea!</p>
      </div>
    );
  }

  const totalTareas = tareas.length;
  const completadas = tareas.filter((t: Tarea) => t.completada).length;
  const pendientes = totalTareas - completadas;

  return (
    <section
      className="max-w-lg mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Estadísticas y filtro */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalTareas}</span> tareas totales •
            <span className="font-medium text-green-600 ml-1">
              {completadas}
            </span>{" "}
            completadas •
            <span className="font-medium text-blue-600 ml-1">{pendientes}</span>{" "}
            pendientes
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filtro}
              onChange={handleFiltroChange}
              className="p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas ({totalTareas})</option>
              <option value="pendientes">Pendientes ({pendientes})</option>
              <option value="completadas">Completadas ({completadas})</option>
            </select>

            {completadas > 0 && (
              <button
                onClick={handleLimpiarCompletadas}
                disabled={limpiarCompletadas.isPending}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                title="Eliminar todas las tareas completadas"
              >
                {limpiarCompletadas.isPending ? "..." : "🧹 Limpiar"}
              </button>
            )}
          </div>
        </div>

        {/* Barra de progreso */}
        {totalTareas > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completadas / totalTareas) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {tareas.map((tarea: Tarea) => (
          <TareaItem
            key={tarea.id}
            {...tarea}
            descripcionMayusculas={descripcionMayusculas}
          />
        ))}
      </div>
    </section>
  );
};

interface TareaItemProps extends Tarea {
  descripcionMayusculas: boolean;
}

export const TareaItem = ({
  id,
  nombre,
  completada,
  tableroId,
  descripcionMayusculas,
}: TareaItemProps) => {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);

  const toggleMutation = useMutation({
    mutationFn: async () => {
      console.log(`🔄 Cambiando estado de tarea ${id}`);
      await api.patch(`/api/tareas/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success(
        `Tarea ${completada ? "desmarcada" : "marcada"} como completada`,
        { duration: 2000 }
      );
    },
    onError: (error: any) => {
      console.error("❌ Error al cambiar estado:", error);
      const errorMessage =
        error.response?.status === 403
          ? "No tienes permisos para modificar esta tarea"
          : "Error al cambiar el estado de la tarea";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log(`🗑️ Eliminando tarea ${id}`);
      await api.delete(`/api/tareas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tarea eliminada correctamente", { duration: 2000 });
    },
    onError: (error: any) => {
      console.error("❌ Error al eliminar:", error);
      const errorMessage =
        error.response?.status === 403
          ? "No tienes permisos para eliminar esta tarea"
          : "Error al eliminar la tarea";
      toast.error(errorMessage);
    },
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      if (!nuevoNombre.trim()) {
        throw new Error("El nombre no puede estar vacío");
      }
      console.log(`✏️ Editando tarea ${id} con nombre "${nuevoNombre}"`);
      await api.put(`/api/tareas/${id}`, { nombre: nuevoNombre });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      setEditando(false);
      toast.success(`Tarea actualizada correctamente`, {
        duration: 2000,
      });
    },
    onError: (error: any) => {
      console.error("❌ Error al editar:", error);
      let errorMessage = "Error al actualizar la tarea";

      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para editar esta tarea";
      } else if (error.message === "El nombre no puede estar vacío") {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  const handleEdit = () => {
    if (editando) {
      editMutation.mutate();
    } else {
      setEditando(true);
      setNuevoNombre(nombre); // Resetear al valor original cuando se empieza a editar
    }
  };

  const handleCancelEdit = () => {
    setEditando(false);
    setNuevoNombre(nombre); // Volver al valor original
  };

  const handleDelete = () => {
    if (
      confirm(`¿Estás seguro de que quieres eliminar la tarea "${nombre}"?`)
    ) {
      deleteMutation.mutate();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      editMutation.mutate();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-3 border-b border-gray-200 transition-all duration-200 ${
        completada ? "bg-gray-50" : "bg-white"
      } hover:bg-gray-50`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={completada}
        onChange={() => toggleMutation.mutate()}
        disabled={toggleMutation.isPending}
        className="form-checkbox h-5 w-5 text-blue-600 mr-3 cursor-pointer"
        title={completada ? "Marcar como pendiente" : "Marcar como completada"}
      />

      {/* Contenido de la tarea */}
      <div className="flex-1 mr-3">
        {editando ? (
          <input
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full text-lg border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la tarea"
            autoFocus
            disabled={editMutation.isPending}
          />
        ) : (
          <span
            className={`text-lg ${
              completada ? "line-through text-gray-500" : "text-gray-800"
            } ${descripcionMayusculas ? "uppercase" : ""}`}
          >
            {nombre}
          </span>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center space-x-2">
        {editando ? (
          <>
            <button
              onClick={handleEdit}
              disabled={editMutation.isPending || !nuevoNombre.trim()}
              className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Guardar cambios"
            >
              {editMutation.isPending ? "..." : "✓"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={editMutation.isPending}
              className="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              title="Cancelar edición"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditando(true)}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Editar tarea"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              title="Eliminar tarea"
            >
              {deleteMutation.isPending ? "..." : "🗑️"}
            </button>
          </>
        )}
      </div>
    </li>
  );
};
