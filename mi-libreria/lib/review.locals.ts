// --- Funciones y tipos para manejar reseñas locales de libros ---
// Este archivo se encarga de guardar, leer y votar reseñas usando localStorage
import { z } from 'zod';

// Defino el esquema de una reseña usando Zod para validación
export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(5).max(2000),
  createdAt: z.number(),
  up: z.number().default(0),
  down: z.number().default(0),
});
export type Review = z.infer<typeof ReviewSchema>;

// Claves para guardar reseñas y votos en localStorage
const KEY = (volumeId: string) => `reviews:${volumeId}`;
const VOTEKEY = (reviewId: string) => `vote:${reviewId}`;

// Obtiene todas las reseñas de un libro desde localStorage
export function getReviews(volumeId: string): Review[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY(volumeId));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown[];
    return arr.map((r) => ReviewSchema.parse(r));
  } catch {
    return [];
  }
}

// Guarda el array de reseñas en localStorage
export function saveReviews(volumeId: string, reviews: Review[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY(volumeId), JSON.stringify(reviews));
}

// Crea una nueva reseña y la guarda en localStorage
export function createReview(volumeId: string, data: { rating: number; content: string }) {
  const all = getReviews(volumeId);
  const r: Review = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()),
    rating: data.rating,
    content: data.content,
    createdAt: Date.now(),
    up: 0,
    down: 0,
  };
  all.unshift(r);
  saveReviews(volumeId, all);
  return r;
}

// Vota una reseña (up/down) y guarda el voto en localStorage
export function voteReview(volumeId: string, reviewId: string, delta: 1 | -1) {
  const all = getReviews(volumeId);
  const idx = all.findIndex((r) => r.id === reviewId);
  if (idx === -1) return;

  const mark = localStorage.getItem(VOTEKEY(reviewId)); // "1" | "-1" | null

  if (!mark) {
    if (delta === 1) all[idx].up += 1; else all[idx].down += 1;
    localStorage.setItem(VOTEKEY(reviewId), String(delta));
  } else if (Number(mark) === delta) {
    if (delta === 1) all[idx].up = Math.max(0, all[idx].up - 1);
    else all[idx].down = Math.max(0, all[idx].down - 1);
    localStorage.removeItem(VOTEKEY(reviewId));
  } else {
    if (delta === 1) { all[idx].up += 1; all[idx].down = Math.max(0, all[idx].down - 1); }
    else { all[idx].down += 1; all[idx].up = Math.max(0, all[idx].up - 1); }
    localStorage.setItem(VOTEKEY(reviewId), String(delta));
  }

  saveReviews(volumeId, all);
}
// lib/googleBooks.ts

export type Volume = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    pageCount?: number;
    categories?: string[];
    publisher?: string;
    publishedDate?: string;
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
};

const BASE = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(q: string, startIndex = 0, maxResults = 24) {
  const url = `${BASE}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache de 1h en RSC
  if (!res.ok) throw new Error('Error al consultar Google Books');
  return (await res.json()) as { items?: Volume[]; totalItems?: number };
}

export async function getVolume(volumeId: string) {
  const url = `${BASE}/${volumeId}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Libro no encontrado');
  return (await res.json()) as Volume;
}

/**
 * Devuelve la mejor imagen disponible y fuerza HTTPS si llega como HTTP.
 * Así evitás "mixed content" y no necesitás autorizar protocolo http en next/image.
 */
export function bestImage(v?: Volume['volumeInfo']) {
  const links = v?.imageLinks;
  const url =
    links?.extraLarge ||
    links?.large ||
    links?.medium ||
    links?.small ||
    links?.thumbnail ||
    links?.smallThumbnail ||
    '';

  // Forzar https si viene http
  return url ? url.replace(/^http:\/\//, 'https://') : '';
}
