import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getReviews, saveReview, voteReview } from '../lib/localStorage';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getReviews', () => {
    it('returns empty array if no reviews exist', () => {
      expect(getReviews('book1')).toEqual([]);
    });

    it('returns reviews from localStorage', () => {
      const reviews = [{ id: 1, name: 'Juan', rating: 5, text: 'Great book!', votes: 0 }];
      localStorage.setItem('reviews_book1', JSON.stringify(reviews));
      expect(getReviews('book1')).toEqual(reviews);
    });

    it('returns empty array on server-side (no window)', () => {
      const originalWindow = window;
      // @ts-ignore
      delete global.window;
      expect(getReviews('book1')).toEqual([]);
      global.window = originalWindow;
    });
  });

  describe('saveReview', () => {
    it('saves a new review with id and votes', () => {
      const review = { name: 'Ana', rating: 4, text: 'Good read' };
      saveReview('book1', review);
      const savedReviews = getReviews('book1');
      expect(savedReviews).toHaveLength(1);
      expect(savedReviews[0]).toMatchObject({
        ...review,
        id: expect.any(Number),
        votes: 0,
      });
    });

    it('appends to existing reviews', () => {
      const review1 = { name: 'Juan', rating: 5, text: 'Great!' };
      const review2 = { name: 'Ana', rating: 4, text: 'Good' };
      saveReview('book1', review1);
      saveReview('book1', review2);
      expect(getReviews('book1')).toHaveLength(2);
    });
  });

  describe('voteReview', () => {
    it('increments votes for a review', () => {
      const review = { id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 0 };
      localStorage.setItem('reviews_book1', JSON.stringify([review]));
      voteReview('book1', 1, 1);
      expect(getReviews('book1')[0].votes).toBe(1);
    });

    it('decrements votes for a review', () => {
      const review = { id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 0 };
      localStorage.setItem('reviews_book1', JSON.stringify([review]));
      voteReview('book1', 1, -1);
      expect(getReviews('book1')[0].votes).toBe(-1);
    });

    it('does not affect other reviews', () => {
      const reviews = [
        { id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 0 },
        { id: 2, name: 'Ana', rating: 4, text: 'Good', votes: 0 },
      ];
      localStorage.setItem('reviews_book1', JSON.stringify(reviews));
      voteReview('book1', 1, 1);
      expect(getReviews('book1')[1].votes).toBe(0);
    });
  });
});