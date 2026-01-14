// src/app/features/recordings/services/storage.service.ts
// Repositorio de metadatos basado en AsyncStorage (sin tocar archivos del FS).
// Útil si querés persistir/cargar fuera del store, hacer backups o migraciones.
// Si ya usás Zustand + persist, podés seguir usando este servicio como utilitario
// para exportar/importar listas de RecordingMeta sin acoplarte al formato del store.
//
// Dependencias:
//   npm i @react-native-async-storage/async-storage
//
// Integra con:
//   - model/types.ts → RecordingMeta, isRecordingMeta

import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRecordingMeta, type RecordingMeta } from "../model/types";

const STORAGE_KEY = "voice-recorder.metas.v1";

/* ======================= API principal ======================= */

/** Carga todos los metadatos guardados (ordenados desc por fecha). */
export async function loadAllMetas(): Promise<RecordingMeta[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const metas = parsed.filter(isRecordingMeta) as RecordingMeta[];
    metas.sort(sortByDateDesc);
    return metas;
  } catch {
    return [];
  }
}

/** Reemplaza TODA la colección persistida. */
export async function saveAllMetas(metas: RecordingMeta[]): Promise<void> {
  const clean = metas.filter(isRecordingMeta).sort(sortByDateDesc);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

/** Inserta o actualiza (por id) un meta y persiste. */
export async function upsertMeta(meta: RecordingMeta): Promise<void> {
  const all = await loadAllMetas();
  const idx = all.findIndex((m) => m.id === meta.id);
  if (idx >= 0) all[idx] = meta;
  else all.unshift(meta);
  await saveAllMetas(all);
}

/** Elimina por id y persiste. Devuelve true si eliminó algo. */
export async function removeMeta(id: string): Promise<boolean> {
  const all = await loadAllMetas();
  const next = all.filter((m) => m.id !== id);
  const changed = next.length !== all.length;
  if (changed) await saveAllMetas(next);
  return changed;
}

/** Renombra un meta (solo nombre visible) y persiste. */
export async function renameMeta(id: string, newName: string): Promise<boolean> {
  const all = await loadAllMetas();
  const idx = all.findIndex((m) => m.id === id);
  if (idx < 0) return false;
  all[idx] = { ...all[idx], name: (newName || "").trim() || all[idx].name };
  await saveAllMetas(all);
  return true;
}

/** Busca un meta por id (sin modificar persistencia). */
export async function findMeta(id: string): Promise<RecordingMeta | undefined> {
  const all = await loadAllMetas();
  return all.find((m) => m.id === id);
}

/** Limpia toda la colección de metadatos. (No borra archivos del FS). */
export async function clearAllMetas(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/* ======================= Utilidades ======================= */

function sortByDateDesc(a: RecordingMeta, b: RecordingMeta) {
  const ta = Date.parse(a.createdAt || "");
  const tb = Date.parse(b.createdAt || "");
  return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
}

/* ======================= Migraciones / Backups (opcionales) ======================= */

/**
 * Exporta los metadatos a una cadena JSON (por ejemplo para guardarla en un archivo
 * o enviar a un backend). No incluye el contenido de los audios.
 */
export async function exportMetasAsJSON(pretty = false): Promise<string> {
  const all = await loadAllMetas();
  return JSON.stringify(all, null, pretty ? 2 : 0);
}

/**
 * Importa una cadena JSON (array de RecordingMeta), la valida y la persiste.
 * Por defecto hace un merge (upsert por id). Si `replace` es true, reemplaza todo.
 */
export async function importMetasFromJSON(json: string, replace = false): Promise<void> {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error("Formato inválido: se esperaba un array");
  const incoming = parsed.filter(isRecordingMeta) as RecordingMeta[];
  if (replace) {
    await saveAllMetas(incoming);
    return;
    }
  const current = await loadAllMetas();
  const map = new Map<string, RecordingMeta>();
  for (const m of current) map.set(m.id, m);
  for (const m of incoming) map.set(m.id, m);
  await saveAllMetas(Array.from(map.values()));
}

/**
 * Si alguna vez cambiaste de clave de almacenamiento (p. ej. desde un prototipo)
 * podés migrar contenidos antiguos a la clave actual.
 */
export async function migrateFromKey(oldKey: string): Promise<boolean> {
  if (!oldKey || oldKey === STORAGE_KEY) return false;
  try {
    const raw = await AsyncStorage.getItem(oldKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;
    const oldMetas = parsed.filter(isRecordingMeta) as RecordingMeta[];
    if (oldMetas.length === 0) return false;

    const current = await loadAllMetas();
    const map = new Map<string, RecordingMeta>();
    for (const m of current) map.set(m.id, m);
    for (const m of oldMetas) map.set(m.id, m);

    await saveAllMetas(Array.from(map.values()));
    await AsyncStorage.removeItem(oldKey);
    return true;
  } catch {
    return false;
  }
}

/* ======================= Notas ======================= */
/*
- Este servicio NO elimina archivos de audio. Para eso, usar file-system.service.ts.
- Si estás usando el store zustand con persist (clave "recordings-store-v1"),
  evitá escribir directamente sobre esa clave desde acá para no desincronizar UI.
  En su lugar, cargá/guardá con estas funciones y luego sincronizá con las acciones del store.
*/
