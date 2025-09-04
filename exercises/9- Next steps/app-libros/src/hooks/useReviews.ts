// src/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, postReview, voteReviewApi, Review } from "@/services/reviewsService";


export function useReviews(bookId: string) {
  return useQuery<Review[], Error>({
    queryKey: ["reviews", bookId],
    queryFn: () => getReviews(bookId),
    enabled: !!bookId,
  });
}

export function useAddReview(bookId: string, user: string) {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, { text: string; rating: number }>({
    mutationFn: async (variables) => {
      const { text, rating } = variables;
      return postReview(bookId, user, text, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
  });
}

// Hook para votar una reseña
export function useVoteReview(bookId: string, user: string) {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, { reviewId: string; vote: number }>({
    mutationFn: async (variables) => {
      const { reviewId, vote } = variables;
      return voteReviewApi(reviewId, vote, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
  });
}
