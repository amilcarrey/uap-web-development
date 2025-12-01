// Repo simplificado: cache en memoria.
// En producción, reemplazar con Postgres/knex/prisma.
import { GBVolume } from "../services/googleBooksService";

const CACHE = new Map<string, { item: GBVolume; lastSync: number }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

export const upsertBook = (item: GBVolume) => {
  CACHE.set(item.id, { item, lastSync: Date.now() });
};

export const getBook = (id: string): GBVolume | null => {
  const e = CACHE.get(id);
  if (!e) return null;
  if (Date.now() - e.lastSync > TTL_MS) {
    CACHE.delete(id);
    return null;
  }
  return e.item;
};
