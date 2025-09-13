// src/app/features/recordings/model/state.ts
// Store global (Zustand + persist) para manejar la lista de grabaciones y selección activa.
// - Persiste SOLO metadatos en AsyncStorage (los archivos viven en FileSystem).
// - Acciones: add, remove, rename, setActive, clearAll, replaceAll.
//
// Requisitos:
//   npm i zustand
//   npm i @react-native-async-storage/async-storage
//
// Tipos:
//   Definí RecordingMeta en ./types.ts y mantenelo en un solo lugar.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RecordingMeta } from "./types";

type RecordingsState = {
  recordings: RecordingMeta[];
  activeId: string | null;

  /** Agrega una grabación (al principio, orden más reciente primero). */
  add: (meta: RecordingMeta) => void;

  /** Elimina por id (NO borra el archivo del FS; eso se hace en capa de servicio/UI). */
  remove: (id: string) => void;

  /** Renombra una grabación. */
  rename: (id: string, newName: string) => void;

  /** Reemplaza toda la colección (útil para hidratar desde el FS/servicio). */
  replaceAll: (items: RecordingMeta[]) => void;

  /** Selecciona la grabación activa (para mostrar controles expandibles en UI). */
  setActive: (id: string | null) => void;

  /** Limpia TODO (útil para “borrar todo” en settings). */
  clearAll: () => void;
};

const sortByDateDesc = (a: RecordingMeta, b: RecordingMeta) => {
  const ta = Date.parse(a.createdAt || "");
  const tb = Date.parse(b.createdAt || "");
  return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
};

export const useRecordingsStore = create<RecordingsState>()(
  persist(
    (set, get) => ({
      recordings: [],
      activeId: null,

      add: (meta) =>
        set((s) => ({
          recordings: [meta, ...s.recordings].sort(sortByDateDesc),
        })),

      remove: (id) =>
        set((s) => {
          const next = s.recordings.filter((r) => r.id !== id);
          const wasActive = s.activeId === id;
          return {
            recordings: next,
            activeId: wasActive ? null : s.activeId,
          };
        }),

      rename: (id, newName) =>
        set((s) => ({
          recordings: s.recordings.map((r) =>
            r.id === id ? { ...r, name: newName?.trim() || r.name } : r
          ),
        })),

      replaceAll: (items) =>
        set(() => ({
          recordings: [...items].sort(sortByDateDesc),
        })),

      setActive: (id) => set(() => ({ activeId: id })),

      clearAll: () => set(() => ({ recordings: [], activeId: null })),
    }),
    {
      name: "recordings-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persistimos solo lo necesario
        recordings: state.recordings,
        activeId: state.activeId,
      }),
      // Nota: si cambiás el shape de RecordingMeta, considerá una migración:
      migrate: (persisted: any, version) => persisted,
      version: 1,
    }
  )
);

/* ---------- Selectores útiles (opcional) ---------- */

export const useRecordings = () =>
  useRecordingsStore((s) => s.recordings);

export const useActiveId = () =>
  useRecordingsStore((s) => s.activeId);

export const useIsActive = (id?: string | null) =>
  useRecordingsStore((s) => (id ? s.activeId === id : s.activeId === null));

export const findRecordingById = (id: string) =>
  useRecordingsStore.getState().recordings.find((r) => r.id === id);

/*
  Notas de uso:

  - Cuando pares una grabación con useRecorder.stop(), tomá el meta resultante
    y hacé: useRecordingsStore.getState().add(meta)

  - Para reproducir con usePlayer, podés leer el activo desde el store (activeId)
    y en la UI expandir los controles del item activo.

  - La eliminación física del archivo de audio debería hacerse desde la UI/servicio:
      await FileSystem.deleteAsync(item.fileUri);
      useRecordingsStore.getState().remove(item.id);

  - Si más adelante querés cachear “última posición reproducida” por grabación,
    podés añadir un diccionario { [id]: lastPositionMs } al state y persistirlo.
*/
