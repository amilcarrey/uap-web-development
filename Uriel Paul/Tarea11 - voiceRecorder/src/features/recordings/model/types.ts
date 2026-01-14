// src/app/features/recordings/model/types.ts
// Tipos centrales para la feature de “grabaciones”.
// Usalos en hooks, servicios, componentes y store para evitar duplicados
// y mantener consistente el shape de los datos.

/** Identificador único de una grabación (local). */
export type RecordingId = string;

/** Estados de reproducción de un audio. */
export type PlayerStatus = "idle" | "loading" | "playing" | "paused";

/** Estados del flujo de grabación. */
export type RecordStatus = "idle" | "recording" | "saving" | "blocked";

/** Metadatos persistidos de cada grabación. */
export type RecordingMeta = {
  id: RecordingId;
  /** Ruta absoluta al archivo en el FS (p. ej., FileSystem.documentDirectory + RECORDINGS_DIR + fileName). */
  fileUri: string;
  /** Nombre visible (sin extensión). */
  name: string;
  /** Fecha de creación (ISO 8601). */
  createdAt: string;
  /** Duración en milisegundos. */
  durationMs: number;
  /** Tamaño del archivo en bytes (opcional). */
  sizeBytes?: number;
};

/** Directorio relativo donde guardamos los audios dentro de documentDirectory. */
export const RECORDINGS_DIR = "recordings/";

/** Extensión por defecto de los archivos de audio grabados. */
export const RECORDING_EXT = ".m4a";

/** Guard de tipo útil al hidratar desde almacenamiento/FS. */
export function isRecordingMeta(x: any): x is RecordingMeta {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.fileUri === "string" &&
    typeof x.name === "string" &&
    typeof x.createdAt === "string" &&
    typeof x.durationMs === "number"
  );
}
