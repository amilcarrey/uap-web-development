// Definir interfaces para los tipos de Google Books API
interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  language?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

interface GoogleBooksVolume {
  id: string;
  volumeInfo?: GoogleBooksVolumeInfo;
}

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

// Funciones utilitarias (no son Server Actions)
export function mapVolumeToSimple(volume: GoogleBooksVolume | null | undefined): SimpleBook {
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

export function mapVolumeToDetailed(volume: GoogleBooksVolume | null | undefined): DetailedBook {
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