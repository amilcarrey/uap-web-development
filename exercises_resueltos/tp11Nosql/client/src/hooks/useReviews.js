import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useReviews = (bookId) => {
    const [reviews, setReviews] = useState([]);
    const { user } = useAuth();

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`/api/reviews/${bookId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    }, [bookId]);

    useEffect(() => {
        if (bookId) {
            fetchReviews();
        }
    }, [bookId, fetchReviews]);

    const addReview = async (reviewData) => {
        if (!user) return;

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    bookId,
                    ...reviewData,
                }),
            });

            if (response.ok) {
                fetchReviews();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Failed to add review:', error);
            throw error;
        }
    };

    const voteReview = async (reviewId, value) => {
        if (!user) return;

        try {
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    reviewId,
                    value,
                }),
            });

            if (response.ok) {
                // Optimistic update or refetch
                fetchReviews();
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!user) return;

        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    return { reviews, addReview, voteReview, deleteReview };
};
