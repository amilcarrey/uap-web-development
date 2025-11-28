'use server'

import { type SimpleBook, type DetailedBook, mapVolumeToSimple, mapVolumeToDetailed } from '../lib/book-utils';

// Re-exportar las funciones utilitarias para testing
export { mapVolumeToSimple, mapVolumeToDetailed };

export async function searchBooks(query: string): Promise<SimpleBook[]> {
  if (!query || query.trim().length === 0) return [];
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
    const res = await fetch(url, { 
      cache: 'no-store',
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Manejar respuestas null, undefined o sin items
    if (!data || typeof data !== 'object') return [];
    if (!data.items || !Array.isArray(data.items)) return [];
    
    return data.items.map(mapVolumeToSimple);
  } catch (error: unknown) {
    console.error('Error searching books:', error);
    
    // Manejo específico de errores - retornar array vacío en lugar de lanzar excepciones
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON response');
      return [];
    }
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.name === 'TimeoutError') {
        console.error('Request timeout');
        return [];
      }
      if (error.message.includes('fetch') || error.message.includes('Network') || 
          error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.error('Network error');
        return [];
      }
    }
    
    return [];
  }
}

export async function getBookById(id: string): Promise<DetailedBook | null> {
  if (!id || id.trim().length === 0) return null;
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    const res = await fetch(url, { 
      cache: 'no-store',
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });
    
    if (!res.ok) {
      return null; // Cambiar throw por return null
    }
    
    const volume = await res.json();
    
    // Manejar respuestas null, undefined
    if (!volume || typeof volume !== 'object') return null;
    
    return mapVolumeToDetailed(volume);
  } catch (error: unknown) {
    console.error('Error fetching book by ID:', error);
    
    // Retornar null en todos los casos de error
    return null;
  }
}