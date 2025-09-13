import { Review } from '@/types'

export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return sum / reviews.length
}

export const sortReviewsByVotes = (reviews: Review[]): Review[] => {
  return [...reviews].sort((a, b) => b.votes - a.votes)
}

export const validateReview = (review: { rating: number; comment: string }): string[] => {
  const errors: string[] = []
  
  if (review.rating < 1 || review.rating > 5) {
    errors.push('La calificación debe estar entre 1 y 5 estrellas')
  }
  
  if (!review.comment.trim()) {
    errors.push('La reseña no puede estar vacía')
  }
  
  if (review.comment.length > 1000) {
    errors.push('La reseña no puede tener más de 1000 caracteres')
  }
  
  return errors
}