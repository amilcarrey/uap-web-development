import { useEliminarCompletadas } from "../hooks/useEliminarCompletadas";
import { useClientStore } from "../store/clientStore";

interface EliminarCompletadasProps {
  tableroAlias?: string; 
}

export default function EliminarCompletadas({ tableroAlias }: EliminarCompletadasProps) {
  const { mostrarToast } = useClientStore();
  const eliminarMutation = useEliminarCompletadas(tableroAlias); // 👈 PASAR: tableroAlias al hook

  const handleEliminar = () => {
    eliminarMutation.mutate(undefined, {
      onSuccess: () => mostrarToast("Tareas completadas eliminadas", "exito"),
      onError: () => mostrarToast("Error al eliminar tareas", "error"),
    });
  };

  return (
    <button
      onClick={handleEliminar}
      disabled={eliminarMutation.isPending}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {eliminarMutation.isPending ? "Eliminando..." : "Eliminar Completadas"}
    </button>
  );
}
