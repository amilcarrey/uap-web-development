import { useState, useEffect } from 'react';

const STORAGE_KEY = 'book_reviews';

export const useReviews = (bookId) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const storedReviews = localStorage.getItem(STORAGE_KEY);
        if (storedReviews) {
            const allReviews = JSON.parse(storedReviews);
            setReviews(allReviews[bookId] || []);
        }
    }, [bookId]);

    const saveReviews = (newReviews) => {
        const storedReviews = localStorage.getItem(STORAGE_KEY);
        const allReviews = storedReviews ? JSON.parse(storedReviews) : {};
        allReviews[bookId] = newReviews;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
        setReviews(newReviews);
    };

    const addReview = (review) => {
        const newReview = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            votes: 0,
            ...review,
        };
        saveReviews([newReview, ...reviews]);
    };

    const voteReview = (reviewId, value) => {
        const newReviews = reviews.map((review) => {
            if (review.id === reviewId) {
                return { ...review, votes: review.votes + value };
            }
            return review;
        });
        saveReviews(newReviews);
    };

    return { reviews, addReview, voteReview };
};
