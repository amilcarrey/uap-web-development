// Hook para acceder fácilmente a la configuración global de la app
import { useConfigStore } from "../store/configStore";

export function useConfig() {
  const refetchInterval = useConfigStore((s) => s.refetchInterval);
  const descripcionMayuscula = useConfigStore((s) => s.descripcionMayuscula);
  return { refetchInterval, descripcionMayuscula };
}
