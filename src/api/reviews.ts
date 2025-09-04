import axios from 'axios'
import type { Review, NewReview } from '../types/review'

const BASE = 'http://localhost:4000/reviews'

export function fetchReviews(bookId: string) {
  return axios.get<Review[]>(`${BASE}?bookId=${bookId}`)
}

export function postReview(review: NewReview) {
  return axios.post<Review>(BASE, { 
    ...review, 
    upVotes: 0, 
    downVotes: 0, 
    author: 'Anónimo' // si tu backend no lo agrega, puedes setear algo por defecto
  })
}

export function voteReview(
  id: number, 
  delta: Partial<Pick<Review, 'upVotes' | 'downVotes'>>
) {
  return axios.patch<Review>(`${BASE}/${id}`, delta)
}
