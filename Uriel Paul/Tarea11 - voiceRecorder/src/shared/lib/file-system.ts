// src/app/shared/lib/file-system.ts
// Wrapper genérico sobre expo-file-system (SDK 54).
// - Importa la API legacy para evitar warnings.
// - Expone bestBaseDir() y utilidades de paths/FS robustas.

import * as FileSystem from "expo-file-system/legacy";

// Cast a any para acceder a props no tipadas pero presentes en runtime.
const FS: any = FileSystem;

type FileInfoWithMaybeSize = FileSystem.FileInfo & { size?: number };

/* ============================ Paths ============================ */

export function documentDir(): string {
  const d: string | null | undefined = FS.documentDirectory;
  if (!d) throw new Error("documentDirectory no disponible.");
  return d;
}

export function cacheDir(): string {
  const d: string | null | undefined = FS.cacheDirectory;
  if (!d) throw new Error("cacheDirectory no disponible.");
  return d;
}

/** Devuelve el mejor base dir disponible o null (p.ej. en Web). */
export function bestBaseDir(): string | null {
  return (FS.documentDirectory as string | null) ?? (FS.cacheDirectory as string | null) ?? null;
}

/** Asegura una barra final en URIs de carpetas. */
export function ensureTrailingSlash(uri: string): string {
  return uri.endsWith("/") ? uri : uri + "/";
}

/** Une partes de una URI evitando dobles barras. */
export function joinUri(...parts: string[]): string {
  const cleaned = parts
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p.replace(/\/+$/g, "") : p.replace(/^\/+|\/+$/g, "")));
  let out = cleaned.join("/");
  if (cleaned.length > 0 && /^[a-z]+:\/\//i.test(cleaned[0])) {
    out = cleaned[0].replace(/\/+$/g, "") + "/" + cleaned.slice(1).join("/");
  }
  return out;
}

/** Nombre de archivo (con extensión) a partir de una URI. */
export function basename(uri: string): string {
  try {
    const t = uri.replace(/\/+$/g, "");
    return t.substring(t.lastIndexOf("/") + 1) || t;
  } catch {
    return uri;
  }
}

/** Directorio padre (con barra final) a partir de una URI. */
export function dirname(uri: string): string {
  try {
    const t = uri.replace(/\/+$/g, "");
    const i = t.lastIndexOf("/");
    return i >= 0 ? ensureTrailingSlash(t.slice(0, i)) : "";
  } catch {
    return "";
  }
}

/** Extensión en minúsculas (con punto) o cadena vacía. */
export function extname(nameOrUri: string): string {
  const name = basename(nameOrUri);
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i).toLowerCase() : "";
}

/** Sanea un nombre para archivo. */
export function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, " ").replace(/\s+/g, " ").trim();
}

/* ============================ Dirs ============================ */

export async function ensureDir(dirUri: string): Promise<string> {
  const dir = ensureTrailingSlash(dirUri);
  try {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  } catch {}
  return dir;
}

export async function ensureParentDir(fileUri: string): Promise<string> {
  const parent = dirname(fileUri);
  if (!parent) throw new Error("Ruta sin directorio padre válido.");
  await ensureDir(parent);
  return parent;
}

/* ============================ IO ============================ */

export async function readString(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, { encoding: "utf8" as any });
}

export async function writeString(uri: string, data: string): Promise<void> {
  await ensureParentDir(uri);
  return FileSystem.writeAsStringAsync(uri, data, { encoding: "utf8" as any });
}

export async function readJSON<T = unknown>(uri: string, fallback?: T): Promise<T | null> {
  try {
    const raw = await readString(uri);
    return JSON.parse(raw) as T;
  } catch {
    return fallback ?? null;
  }
}

export async function writeJSON(uri: string, value: unknown, pretty = false): Promise<void> {
  const data = JSON.stringify(value, null, pretty ? 2 : 0);
  await writeString(uri, data);
}

/* ============================ FS ============================ */

export async function exists(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return !!info.exists;
  } catch {
    return false;
  }
}

export async function stat(uri: string): Promise<FileSystem.FileInfo> {
  return FileSystem.getInfoAsync(uri);
}

export async function size(uri: string): Promise<number | undefined> {
  try {
    const info = (await stat(uri)) as FileInfoWithMaybeSize;
    return typeof info.size === "number" ? info.size : undefined;
  } catch {
    return undefined;
  }
}

export async function list(dirUri: string): Promise<string[]> {
  try {
    return await FileSystem.readDirectoryAsync(ensureTrailingSlash(dirUri));
  } catch {
    return [];
  }
}

export async function listFiles(
  dirUri: string,
  { exts }: { exts?: string[] } = {}
): Promise<string[]> {
  const names = await list(dirUri);
  const norm = (exts || []).map((e) => (e.startsWith(".") ? e.toLowerCase() : "." + e.toLowerCase()));
  return names.filter((n) => (norm.length ? norm.includes(extname(n)) : true)).map((n) => joinUri(dirUri, n));
}

export async function remove(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {}
}

export async function move(fromUri: string, toUri: string, overwrite = false): Promise<void> {
  await ensureParentDir(toUri);
  if (overwrite && (await exists(toUri))) await remove(toUri);
  await FileSystem.moveAsync({ from: fromUri, to: toUri });
}

export async function copy(fromUri: string, toUri: string, overwrite = false): Promise<void> {
  await ensureParentDir(toUri);
  if (overwrite && (await exists(toUri))) await remove(toUri);
  await FileSystem.copyAsync({ from: fromUri, to: toUri });
}

/* ============================ Utilidades ============================ */

export async function uniquePath(dirUri: string, baseName: string): Promise<string> {
  const dir = ensureTrailingSlash(dirUri);
  const safeBase = sanitizeFileName(baseName);
  const dot = safeBase.lastIndexOf(".");
  const name = dot > 0 ? safeBase.slice(0, dot) : safeBase;
  const ext = dot > 0 ? safeBase.slice(dot) : "";

  let n = 0;
  let candidate = joinUri(dir, safeBase);
  while (await exists(candidate)) {
    n += 1;
    candidate = joinUri(dir, `${name} (${n})${ext}`);
  }
  return candidate;
}

export async function downloadToFile(url: string, toUri: string): Promise<string> {
  await ensureParentDir(toUri);
  const { uri } = await FileSystem.downloadAsync(url, toUri);
  return uri;
}
