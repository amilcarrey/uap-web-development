'use server'

import { SimpleBook, DetailedBook, mapVolumeToSimple, mapVolumeToDetailed } from '../lib/book-utils';

// Re-exportar los tipos e interfaces para mantener compatibilidad
export type { SimpleBook, DetailedBook };

// Re-exportar las funciones utilitarias para testing
export { mapVolumeToSimple, mapVolumeToDetailed };

export async function searchBooks(query: string): Promise<SimpleBook[]> {
  if (!query || query.trim().length === 0) return [];
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // Manejar respuestas null, undefined o sin items
    if (!data || typeof data !== 'object') return [];
    if (!data.items || !Array.isArray(data.items)) return [];
    
    return data.items.map(mapVolumeToSimple);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

export async function getBookById(id: string): Promise<DetailedBook | null> {
  if (!id || id.trim().length === 0) return null;
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    
    const volume = await res.json();
    
    // Manejar respuestas null, undefined
    if (!volume || typeof volume !== 'object') return null;
    
    return mapVolumeToDetailed(volume);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return null;
  }
}