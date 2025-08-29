export interface Review {
  id: string;
  bookId: string;
  author: string;
  rating: number; // 1 a 5
  comment: string;
  votesUp: number;
  votesDown: number;
  createdAt: string;
}

export interface CreateReview {
  bookId: string;
  author: string;
  rating: number;
  comment: string;
}
