// src/components/ReviewsSection.tsx
"use client";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ReviewsSectionProps {
  bookId: string;
}

export default function ReviewsSection({ bookId }: ReviewsSectionProps) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-2">Reseñas</h2>
      <ReviewForm bookId={bookId} />
      <ReviewList bookId={bookId} />
    </div>
  );
}
