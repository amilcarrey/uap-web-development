//src/services/googleBooksService.ts.
import fetch from "node-fetch";

const BASE = "https://www.googleapis.com/books/v1/volumes";

export type GBVolume = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: Record<string,string>;
    pageCount?: number;
    publishedDate?: string;
    industryIdentifiers?: {type:string,identifier:string}[];
    categories?: string[];
  };
};

export const searchBooks = async (q: string): Promise<GBVolume[]> => {
  const url = `${BASE}?q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  const json = await res.json() as any;
  return (json.items || []) as GBVolume[];
};

export const getBookById = async (id: string): Promise<GBVolume | null> => {
  const url = `${BASE}/${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  return (await res.json()) as GBVolume;
};
