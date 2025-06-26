import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { FaTrash } from "react-icons/fa";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useTableroAction } from "./hooks/useTableroAction";

export default function HomeTableros() {
  const { agregar: notificar } = useNotificacionesStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tableroAction = useTableroAction(notificar);

  // Obtener tableros del usuario
  const { data: tableros = [], isLoading } = useQuery({
    queryKey: ["tableros"],
    queryFn: async () =>
      (await axios.get("http://localhost:8008/api/tableros", { withCredentials: true })).data,
  });

  console.log(tableros); // <-- ¿Ves "propietario" en cada objeto?

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
      <h2 className="mt-20 text-2xl text-white font-bold mb-6 text-center">Tus tableros</h2>
      {tableros.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-white/60">No tienes tableros aún.</p>
          <button
            className="bg-black border border-white/50 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
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
          {tableros.map((tablero: any) => (
            <div
              key={tablero.id}
              className="flex items-center justify-between backdrop-blur-md border border-white rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate({ to: "/tablero/$tableroId", params: { tableroId: tablero.id } })}
                title="Ver tareas"
              >
                <span className="text-lg font-semibold text-white hover:underline">{tablero.nombre}</span>
                {/* Mostrar propietario debajo del nombre */}
                {tablero.propietario && (
                  <div className="text-xs text-white/60 mt-1">Propietario: {tablero.propietario}</div>
                )}
                <div className="text-xs text-white/40 mt-1">
                  Total: {tablero.total_tareas} | Activas: {tablero.total_activas} | Completadas:{" "}
                  {tablero.total_completadas}
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
          ))}
        </div>
      )}
    </div>
  );
}