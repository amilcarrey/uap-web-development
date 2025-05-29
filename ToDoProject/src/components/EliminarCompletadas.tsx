import { useEliminarCompletadas } from "../hooks/useEliminarCompletadas";
import { useClientStore } from "../store/clientStore";

export default function EliminarCompletadas() {
  const { mostrarToast } = useClientStore();
  const eliminarCompletadasMutation = useEliminarCompletadas();

  const handleEliminarCompletadas = () => {
    eliminarCompletadasMutation.mutate(undefined, {
      onSuccess: (idsEliminados) => {
        if (idsEliminados.length > 0) {
          mostrarToast(`${idsEliminados.length} tareas completadas eliminadas`, "exito");
        } else {
          mostrarToast("No hay tareas completadas para eliminar", "info");
        }
      },
      onError: () => mostrarToast("Error al eliminar tareas completadas", "error"),
    });
  };

  return (
    <div className="flex justify-center">
      <button 
        onClick={handleEliminarCompletadas}
        disabled={eliminarCompletadasMutation.isPending}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
      >
        {eliminarCompletadasMutation.isPending ? "🗑️ Eliminando..." : "🗑️ Eliminar Completadas"}
      </button>
    </div>
  );
}
