export interface GoogleBooksResponse {
  items: Book[];
  totalItems: number;
}

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
  };
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle?: string;
  rating: number; // 1-5 estrellas
  comment: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface BookWithReviews extends Book {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
