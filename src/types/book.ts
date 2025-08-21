export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
}

export interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export interface GoogleBooksResponse {
  items?: GoogleBooksItem[];
}

