import { useEliminarCompletadas, getTableroIdFromAlias } from "../hooks/useTareas";
import { useEffect, useState } from "react";
import { useClientStore } from "../store/clientStore";

interface EliminarCompletadasProps {
  tableroAlias?: string;
}

export default function EliminarCompletadas({ tableroAlias }: EliminarCompletadasProps) {
  const { mostrarToast } = useClientStore();
  const [tableroId, setTableroId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (tableroAlias) {
      getTableroIdFromAlias(tableroAlias).then(setTableroId);
    }
  }, [tableroAlias]);

  const eliminarMutation = useEliminarCompletadas(tableroId);

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
