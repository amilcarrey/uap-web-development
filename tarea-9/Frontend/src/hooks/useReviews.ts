import { useState, useCallback } from "react";
import { api } from "../api/client";

export const useReviews = (bookId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/books/${bookId}/reviews`);
      setReviews(res.data);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const submitReview = async (payload: { userId?: string; rating: number; content?: string }) => {
    await api.post("/reviews", { bookId, ...payload });
    await fetchReviews();
  };

  const vote = async (reviewId: number, voteValue: 1 | -1, userId = "anonymous") => {
    // optimistic UI: update local state first
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, score: r.score + voteValue } : r));
    try {
      await api.post(`/reviews/${reviewId}/vote`, { userId, vote: voteValue });
      await fetchReviews();
    } catch (err) {
      // revert fetch
      await fetchReviews();
      throw err;
    }
  };

  return { reviews, loading, fetchReviews, submitReview, vote };
};
