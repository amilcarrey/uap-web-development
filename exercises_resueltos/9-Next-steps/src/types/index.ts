export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  imageUrl?: string;
  isbn?: string;
  pageCount?: number;
  categories: string[];
}

export interface Review {
  id: string;
  bookId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  votes: number;
}