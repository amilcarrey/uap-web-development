import { Review } from './types/index';

const STORAGE_KEY = 'book_reviews';

export class ReviewsService {
  private static getReviewsFromStorage(): Review[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveReviewsToStorage(reviews: Review[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  static getReviewsForBook(bookId: string): Review[] {
    const allReviews = this.getReviewsFromStorage();
    if (!bookId) {
      return allReviews;
    }
    return allReviews.filter(review => review.bookId === bookId);
  }

  static addReview(review: Omit<Review, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>): Review {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0
    };

    const allReviews = this.getReviewsFromStorage();
    allReviews.push(newReview);
    this.saveReviewsToStorage(allReviews);

    return newReview;
  }

  static voteReview(reviewId: string, vote: 'up' | 'down'): void {
    const allReviews = this.getReviewsFromStorage();
    const reviewIndex = allReviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex !== -1) {
      if (vote === 'up') {
        allReviews[reviewIndex].upvotes++;
      } else {
        allReviews[reviewIndex].downvotes++;
      }
      
      this.saveReviewsToStorage(allReviews);
    }
  }

  static updateReview(reviewId: string, updates: { rating: number; comment: string }): void {
    const allReviews = this.getReviewsFromStorage();
    const reviewIndex = allReviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex !== -1) {
      allReviews[reviewIndex] = {
        ...allReviews[reviewIndex],
        rating: updates.rating,
        comment: updates.comment
      };
      
      this.saveReviewsToStorage(allReviews);
    }
  }
}