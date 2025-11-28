// src/app/shared/lib/async-storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ========================= helpers internos ========================= */

function nsKey(ns: string, key: string) {
  return `${ns}:${key}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeStringify(v: unknown) {
  try {
    return JSON.stringify(v);
  } catch {
    // fallback simple para objetos con referencias circulares
    return String(v);
  }
}

/* ========================= API namespaced ========================= */

export type NamespacedStorage = {
  /** Namespace actual (prefijo de claves). */
  namespace: string;

  // Strings
  getString: (key: string) => Promise<string | null>;
  setString: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;

  // JSON
  getJSON: <T>(key: string, fallback?: T) => Promise<T | null>;
  setJSON: <T>(key: string, value: T) => Promise<void>;
  mergeJSON: <T extends object>(key: string, patch: Partial<T>) => Promise<T | null>;

  // TTL (expiración en ms; sólo para JSON)
  setJSONWithTTL: <T>(key: string, value: T, ttlMs: number) => Promise<void>;
  getJSONWithTTL: <T>(key: string) => Promise<T | null>;

  // Gestión de namespace
  keys: () => Promise<string[]>;
  clearNamespace: () => Promise<number>; // devuelve cuántas claves borró
};

export function createStorage(namespace = "app"): NamespacedStorage {
  // Estructura para TTL
  type Box<T> = { v: T; exp: number }; // exp = epoch ms

  // Definimos el objeto primero para poder referenciarlo internamente (evita `this`)
  const api: NamespacedStorage = {
    namespace,

    /* -------- strings -------- */
    async getString(key: string): Promise<string | null> {
      return AsyncStorage.getItem(nsKey(namespace, key));
    },

    async setString(key: string, value: string): Promise<void> {
      await AsyncStorage.setItem(nsKey(namespace, key), value);
    },

    async remove(key: string): Promise<void> {
      await AsyncStorage.removeItem(nsKey(namespace, key));
    },

    /* -------- JSON -------- */
    async getJSON<T>(key: string, fallback?: T): Promise<T | null> {
      const raw = await AsyncStorage.getItem(nsKey(namespace, key));
      const parsed = safeParse<T>(raw);
      if (parsed == null) return fallback ?? null;
      return parsed;
    },

    async setJSON<T>(key: string, value: T): Promise<void> {
      await AsyncStorage.setItem(nsKey(namespace, key), safeStringify(value));
    },

    async mergeJSON<T extends object>(key: string, patch: Partial<T>): Promise<T | null> {
      const current = (await api.getJSON<T>(key)) ?? ({} as T);
      const next = { ...(current as any), ...(patch as any) } as T;
      await api.setJSON<T>(key, next);
      return next;
    },

    /* -------- TTL JSON -------- */
    async setJSONWithTTL<T>(key: string, value: T, ttlMs: number): Promise<void> {
      const box: Box<T> = { v: value, exp: Date.now() + Math.max(0, ttlMs) };
      await AsyncStorage.setItem(nsKey(namespace, key), safeStringify(box));
    },

    async getJSONWithTTL<T>(key: string): Promise<T | null> {
      const raw = await AsyncStorage.getItem(nsKey(namespace, key));
      const box = safeParse<Box<T>>(raw);
      if (!box) return null;
      if (typeof box.exp !== "number" || !("v" in box)) {
        // valor no-ttl guardado accidentalmente
        return (box as unknown as T) ?? null;
      }
      if (Date.now() > box.exp) {
        // expirado → borrar y devolver null
        await AsyncStorage.removeItem(nsKey(namespace, key));
        return null;
      }
      return box.v ?? null;
    },

    /* -------- namespace mgmt -------- */
    async keys(): Promise<string[]> {
      const all = await AsyncStorage.getAllKeys();
      const prefix = `${namespace}:`;
      return all.filter((k) => k.startsWith(prefix));
    },

    async clearNamespace(): Promise<number> {
      const ks = await api.keys();
      if (ks.length === 0) return 0;
      await AsyncStorage.multiRemove(ks);
      return ks.length;
    },
  };

  return api;
}

/* ========================= instancia por defecto ========================= */
export const storage = createStorage("app");
