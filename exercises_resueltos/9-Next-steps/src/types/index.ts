export interface Book {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
  categories?: string[];
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

export interface Review {
  id: string;
  bookId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: Book;
  }>;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface CreateReviewRequest {
  bookId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
}

export interface VoteRequest {
  reviewId: string;
  vote: 'upvote' | 'downvote';
}

export interface SearchBooksResponse {
  books: Book[];
  totalItems: number;
  hasMore: boolean;
  actualTotal: number;
}