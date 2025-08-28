import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, PUT } from './route';
import { NextRequest } from 'next/server';

describe('Reviews API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET', () => {
    it('should return empty array when no reviews', async () => {
      const request = new NextRequest('http://localhost/api/reviews');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('should filter by bookId', async () => {
      // First create a review
      const createRequest = new NextRequest('http://localhost/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookId: 'test-123',
          author: 'Test',
          rating: 5,
          title: 'Test',
          content: 'Test'
        })
      });
      await POST(createRequest);

      const request = new NextRequest('http://localhost/api/reviews?bookId=test-123');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].bookId).toBe('test-123');
    });
  });

  describe('POST', () => {
    it('should create a new review', async () => {
      const request = new NextRequest('http://localhost/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookId: 'test-123',
          author: 'Test User',
          rating: 5,
          title: 'Great Book',
          content: 'Excellent!'
        })
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.author).toBe('Test User');
      expect(data.rating).toBe(5);
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookId: 'test-123',
          // Missing required fields
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT', () => {
    it('should handle voting', async () => {
      // First create a review
      const createRequest = new NextRequest('http://localhost/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookId: 'test-123',
          author: 'Test',
          rating: 5,
          title: 'Test',
          content: 'Test'
        })
      });
      const created = await POST(createRequest);
      const review = await created.json();

      const voteRequest = new NextRequest('http://localhost/api/reviews', {
        method: 'PUT',
        body: JSON.stringify({
          reviewId: review.id,
          vote: 'upvote'
        })
      });

      const response = await PUT(voteRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.upvotes).toBe(1);
    });
  });
});