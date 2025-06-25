import { useCallback } from "react";

export function useHandleEditarTexto(
  texto: string,
  nuevoTexto: string,
  setNuevoTexto: (t: string) => void,
  setEditando: (e: boolean) => void,
  actualizarTarea: { mutate: (data: { texto: string }) => void }
) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (nuevoTexto.trim()) {
          actualizarTarea.mutate({ texto: nuevoTexto });
          setEditando(false);
        } else {
          setNuevoTexto(texto);
          setEditando(false);
        }
      } else if (e.key === "Escape") {
        setNuevoTexto(texto);
        setEditando(false);
      }
    },
    [nuevoTexto, texto, setNuevoTexto, setEditando, actualizarTarea]
  );
}