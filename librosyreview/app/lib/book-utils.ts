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
  id?: string; // Cambiar de obligatorio a opcional
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
function mapVolumeToSimple(volume: GoogleBooksVolume | null | undefined): SimpleBook {
  // Caso 1: volume es null o undefined -> retornar undefined para id
  if (!volume) {
    return {
      id: undefined, // Remover 'as any'
      title: 'Título desconocido',
      authors: [],
      thumbnail: undefined // Remover 'as any'
    };
  }

  // Caso 2: volume existe pero no tiene volumeInfo -> usar volume.id
  if (!volume.volumeInfo) {
    return {
      id: volume.id,
      title: 'Título desconocido',
      authors: [],
      thumbnail: undefined // Remover 'as any'
    };
  }

  // Caso 3: volume y volumeInfo existen -> mapeo normal
  const info = volume.volumeInfo;
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

function mapVolumeToDetailed(volume: GoogleBooksVolume | null | undefined): DetailedBook {
  // Caso 1: volume es null o undefined -> retornar undefined para id
  if (!volume) {
    return {
      id: undefined, // Remover 'as any'
      title: 'Título desconocido',
      authors: [],
      categories: [],
      thumbnail: undefined
    };
  }

  // Caso 2: volume existe pero no tiene volumeInfo -> usar volume.id
  if (!volume.volumeInfo) {
    return {
      id: volume.id,
      title: 'Título desconocido',
      authors: [],
      categories: [],
      thumbnail: undefined
    };
  }

  // Caso 3: volume y volumeInfo existen -> mapeo normal
  const info = volume.volumeInfo;
  const imageLinks = info.imageLinks || {};
  
  // Asegurar que authors y categories sean siempre arrays
  let authors = info.authors || [];
  if (!Array.isArray(authors)) {
    authors = [];
  }
  
  let categories = info.categories || [];
  if (!Array.isArray(categories)) {
    categories = [];
  }
  
  return {
    id: volume.id,
    title: info.title || 'Título desconocido',
    authors: authors,
    description: info.description,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    categories: categories,
    publisher: info.publisher,
    language: info.language,
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail
  };
}

// Exportar las funciones e interfaces
export { mapVolumeToSimple, mapVolumeToDetailed };
export type { SimpleBook, DetailedBook };