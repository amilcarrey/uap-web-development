'use server'

export interface SimpleBook {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

export interface DetailedBook extends SimpleBook {
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  language?: string;
}

// Exportar estas funciones para testing
export function mapVolumeToSimple(volume: any): SimpleBook {
  // Manejar casos extremos: null, undefined
  if (!volume || typeof volume !== 'object') {
    return {
      id: undefined as any,
      title: 'Título desconocido',
      authors: [],
      thumbnail: undefined,
    };
  }

  const info = volume.volumeInfo || {};
  const imageLinks = info.imageLinks || {};
  
  // Asegurar que authors sea siempre un array
  let authors = info.authors || [];
  if (!Array.isArray(authors)) {
    authors = [];
  }
  
  return {
    id: volume.id,
    title: info.title || 'Título desconocido',
    authors: authors,
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || undefined,
  };
}

export function mapVolumeToDetailed(volume: any): DetailedBook {
  // Manejar casos extremos: null, undefined
  if (!volume || typeof volume !== 'object') {
    return {
      id: undefined as any,
      title: 'Título desconocido',
      authors: [],
      thumbnail: undefined,
      description: undefined,
      publishedDate: undefined,
      pageCount: undefined,
      categories: [],
      publisher: undefined,
      language: undefined,
    };
  }

  const simple = mapVolumeToSimple(volume);
  const info = volume.volumeInfo || {};
  
  // Asegurar que categories sea siempre un array
  let categories = info.categories || [];
  if (!Array.isArray(categories)) {
    categories = [];
  }
  
  return {
    ...simple,
    description: info.description,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    categories: categories,
    publisher: info.publisher,
    language: info.language,
  };
}

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
    // Manejar errores de red, JSON malformado, etc.
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function getBookById(id: string): Promise<DetailedBook | null> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) return null;
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    
    // Manejar errores de JSON malformado
    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      // Si hay error al parsear JSON, devolver null
      return null;
    }
    
    // Verificar si la respuesta es null o no tiene datos válidos
    if (!data || !data.id) {
      return null;
    }
    
    return mapVolumeToDetailed(data);
  } catch (error) {
    // Manejar errores de red devolviendo null en lugar de propagar
    console.error('Error fetching book:', error);
    return null;
  }
}