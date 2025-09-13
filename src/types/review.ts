export interface Review {
  id: number
  bookId: string
  rating: number
  text: string
  author: string
  upVotes: number
  downVotes: number
}

export type NewReview = Omit<Review, 'id' | 'upVotes' | 'downVotes' | 'author'>
