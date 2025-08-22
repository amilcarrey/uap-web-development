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
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Error al consultar Google Books');
  return (await res.json()) as { items?: Volume[]; totalItems?: number };
}

export async function getVolume(volumeId: string) {
  const url = `${BASE}/${volumeId}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Libro no encontrado');
  return (await res.json()) as Volume;
}

export function bestImage(v?: Volume['volumeInfo']) {
  const links = v?.imageLinks;
  return (
    links?.extraLarge ||
    links?.large ||
    links?.medium ||
    links?.small ||
    links?.thumbnail ||
    links?.smallThumbnail ||
    ''
  );
}
