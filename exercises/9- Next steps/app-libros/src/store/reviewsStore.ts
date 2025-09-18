import {create} from "zustand";

interface Review {
    id: string
    bookId:string;
    user: string;
    text: string;
    rating: number;
    votes: number;
}

interface ReviewsState {
  reviews: Review[];
  addReview: (bookId: string, text: string, rating: number) => void;
  voteReview: (id: string, delta: number) => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
    reviews: [],
    addReview: (bookId, text, rating) =>
        set((state: { reviews: any; }) => ({
        reviews: [
            ...state.reviews,
            {
            id: Date.now().toString(),
            bookId,
            user: "Anonymous",
            text,
            rating,
            votes: 0,
            },
        ],
        })),
    voteReview: (id, delta) =>
        set((state) => ({
        reviews: state.reviews.map((review) =>
            review.id === id ? {...review, votes: review.votes + delta} : review
        ),
        })),
}));