import { describe, it, expect } from 'vitest'
import { calculateAverageRating, sortReviewsByVotes } from '@/utils/reviewUtils'
import { Review } from '@/types'

describe('reviewUtils', () => {
  const mockReviews: Review[] = [
    { id: '1', bookId: '1', author: 'User1', rating: 4, comment: 'Good', date: '2023-01-01', votes: 5 },
    { id: '2', bookId: '1', author: 'User2', rating: 5, comment: 'Excellent', date: '2023-01-02', votes: 10 },
    { id: '3', bookId: '1', author: 'User3', rating: 3, comment: 'Average', date: '2023-01-03', votes: 2 },
  ]

  describe('calculateAverageRating', () => {
    it('should calculate correct average rating', () => {
      const average = calculateAverageRating(mockReviews)
      expect(average).toBe(4) // (4+5+3)/3 = 4
    })

    it('should return 0 for empty array', () => {
      const average = calculateAverageRating([])
      expect(average).toBe(0)
    })

    it('should handle single review', () => {
      const average = calculateAverageRating([mockReviews[0]])
      expect(average).toBe(4)
    })

    it('should handle decimal averages', () => {
      const reviews: Review[] = [
        { ...mockReviews[0], rating: 4 },
        { ...mockReviews[1], rating: 5 },
      ]
      const average = calculateAverageRating(reviews)
      expect(average).toBe(4.5)
    })
  })

  describe('sortReviewsByVotes', () => {
    it('should sort reviews by votes descending', () => {
      const sorted = sortReviewsByVotes(mockReviews)
      expect(sorted[0].votes).toBe(10)
      expect(sorted[1].votes).toBe(5)
      expect(sorted[2].votes).toBe(2)
    })

    it('should return empty array for empty input', () => {
      const sorted = sortReviewsByVotes([])
      expect(sorted).toEqual([])
    })

    it('should handle reviews with same votes', () => {
      const reviews: Review[] = [
        { ...mockReviews[0], votes: 5 },
        { ...mockReviews[1], votes: 5 },
      ]
      const sorted = sortReviewsByVotes(reviews)
      expect(sorted.length).toBe(2)
    })
  })
})