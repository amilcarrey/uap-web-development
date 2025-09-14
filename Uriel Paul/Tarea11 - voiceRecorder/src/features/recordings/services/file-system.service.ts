// src/features/recordings/services/file-system.service.ts
// Servicio de sistema de archivos para la feature “grabaciones”.

import * as FileSystem from "expo-file-system";
import { documentDir, ensureDir } from "@/shared/lib/file-system";
import { RECORDINGS_DIR, RECORDING_EXT, type RecordingMeta } from "../model/types";
import { getDurationFromFile } from "./audio.service";

/* ===================== Rutas y carpeta base ===================== */

export function recordingsDir(): string {
  // Usa el wrapper → evita error de types por documentDirectory
  return `${documentDir()}${RECORDINGS_DIR}`; // p. ej. "file:///.../documents/recordings/"
}

/** Crea la carpeta de grabaciones si no existe. Devuelve la ruta absoluta. */
export async function ensureRecordingsDir(): Promise<string> {
  const dir = recordingsDir();
  await ensureDir(dir); // usa makeDirectoryAsync({ intermediates: true })
  return dir;
}

/* ===================== Helpers de nombres/paths ===================== */

function sanitizeForFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, " ").replace(/\s+/g, " ").trim();
}

export function buildRecordingFileName(baseName?: string, date = new Date()): string {
  const defBase = `Grabación ${stampForName(date)}`;
  const safeBase = sanitizeForFileName(baseName || defBase);
  const hasExt = safeBase.toLowerCase().endsWith(RECORDING_EXT);
  return safeBase + (hasExt ? "" : RECORDING_EXT);
}

export function stampForName(d: Date) {
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const hh = d.getHours().toString().padStart(2, "0");
  const mi = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}-${mi}-${ss}`;
}

export function fileNameFromUri(uri: string): string {
  try {
    const parts = uri.split("/");
    return parts[parts.length - 1] || uri;
  } catch {
    return uri;
  }
}

export function stripExt(name: string): string {
  return name.toLowerCase().endsWith(RECORDING_EXT)
    ? name.slice(0, -RECORDING_EXT.length)
    : name;
}

/* ===================== Operaciones principales ===================== */

export async function moveTempRecordingToLibrary(
  tempUri: string,
  suggestedName?: string
): Promise<{ uri: string; name: string; sizeBytes?: number }> {
  const dir = await ensureRecordingsDir();
  const fileName = buildRecordingFileName(suggestedName);
  const target = dir + fileName;

  await FileSystem.moveAsync({ from: tempUri, to: target });

  // getInfoAsync SIN { size: true } (no existe en InfoOptions)
  let sizeBytes: number | undefined;
  try {
    const info = await FileSystem.getInfoAsync(target);
    sizeBytes = (info as any)?.size ?? undefined; // size existe en runtime
  } catch {}

  return { uri: target, name: stripExt(fileName), sizeBytes };
}

export async function deleteRecordingFile(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // ignorar
  }
}

export async function listRecordingUris(): Promise<string[]> {
  const dir = await ensureRecordingsDir();
  let files: string[] = [];
  try {
    files = await FileSystem.readDirectoryAsync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.toLowerCase().endsWith(RECORDING_EXT))
    .map((f) => dir + f);
}

export async function getFileSize(uri: string): Promise<number | undefined> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return (info as any)?.size ?? undefined;
  } catch {
    return undefined;
  }
}

/* ===================== Hidratación de metadatos ===================== */

function inferCreatedAtFromName(nameNoExt: string): string | undefined {
  const re = /(\d{4})-(\d{2})-(\d{2}) (\d{2})-(\d{2})-(\d{2})/;
  const m = nameNoExt.match(re);
  if (!m) return undefined;
  const [_, Y, M, D, h, m2, s] = m;
  return new Date(Number(Y), Number(M) - 1, Number(D), Number(h), Number(m2), Number(s)).toISOString();
}

function idFromNameAndSize(nameNoExt: string, size?: number) {
  const seed = `${nameNoExt}-${size ?? "?"}-${Math.random().toString(36).slice(2, 6)}`;
  return "rec_" + seed.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
}

export async function metaFromFile(uri: string): Promise<RecordingMeta> {
  const fileName = fileNameFromUri(uri);
  const nameNoExt = stripExt(fileName);
  const sizeBytes = await getFileSize(uri);
  const durationMs = (await getDurationFromFile(uri)) ?? 0;
  const createdAt = inferCreatedAtFromName(nameNoExt) ?? new Date().toISOString();

  return {
    id: idFromNameAndSize(nameNoExt, sizeBytes),
    fileUri: uri,
    name: nameNoExt,
    createdAt,
    durationMs,
    sizeBytes,
  };
}

export async function importExistingFilesAsMetas(): Promise<RecordingMeta[]> {
  const uris = await listRecordingUris();
  const metas: RecordingMeta[] = [];
  for (const uri of uris) {
    try {
      const m = await metaFromFile(uri);
      metas.push(m);
    } catch {}
  }
  metas.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return metas;
}
