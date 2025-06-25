import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { FaTrash } from "react-icons/fa";
import { useNotificacionesStore } from "./store/useNotificacionesStore";

export default function HomeTableros() {
  const { agregar: notificar } = useNotificacionesStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Obtener tableros del usuario
  const { data: tableros = [], isLoading } = useQuery({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8008/api/tableros", { withCredentials: true });
      return res.data;
    },
  });

  // Obtener todas las tareas de todos los tableros
  const { data: tareasPorTablero = {} } = useQuery({
    queryKey: ["tareasPorTablero"],
    queryFn: async () => {
      const result: Record<string, any[]> = {};
      await Promise.all(
        (tableros || []).map(async (tablero: any) => {
          const res = await axios.get("http://localhost:8008/api/tareas", {
            params: { tablero_id: tablero.id },
            withCredentials: true,
          });
          result[tablero.id] = res.data.tareas || [];
        })
      );
      return result;
    },
    enabled: tableros.length > 0,
  });

  // Borrar tablero
  const borrarTableroMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:8008/api/tableros/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      notificar("Tablero eliminado", "error");
    },
    onError: () => {
      notificar("Error al eliminar tablero", "error");
    },
  });

  // Crear tablero
  const crearTableroMutation = useMutation({
    mutationFn: async (nombre: string) => {
      await axios.post("http://localhost:8008/api/tableros", { nombre }, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      notificar("Tablero creado", "success");
    },
    onError: () => {
      notificar("Error al crear tablero", "error");
    },
  });

  if (isLoading) return <div>Cargando tableros...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <h2 className="mt-20 text-2xl font-bold mb-6 text-center">Tus tableros</h2>
      {tableros.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No tienes tableros aún.</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            onClick={() => {
              const nombre = prompt("Nombre del nuevo tablero:");
              if (nombre) crearTableroMutation.mutate(nombre);
            }}
          >
            Crear tablero
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {tableros.map((tablero: any) => {
            const tareas = tareasPorTablero[tablero.id] || [];
            const completadas = tareas.filter((t: any) => t.completada).length;
            const activas = tareas.length - completadas;
            return (
              <div
                key={tablero.id}
                className="flex items-center justify-between backdrop-blur-md bg-white/70 rounded-xl shadow p-4 hover:shadow-lg transition"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate({ to: "/tablero/$tableroId", params: { tableroId: tablero.id } })}
                  title="Ver tareas"
                >
                  <span className="text-lg font-semibold hover:underline">{tablero.nombre}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {tareas.length} | Activas: {activas} | Completadas: {completadas}
                  </div>
                </div>
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => {
                    if (window.confirm("¿Seguro que deseas borrar este tablero?")) {
                      borrarTableroMutation.mutate(tablero.id);
                    }
                  }}
                  title="Borrar tablero"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}