export function getReviews(bookId: string): any[] {
  if (typeof window === 'undefined') return [];
  const reviews = localStorage.getItem(`reviews_${bookId}`);
  return reviews ? JSON.parse(reviews) : [];
}

export function saveReview(bookId: string, review: any) {
  const reviews = getReviews(bookId);
  reviews.push({ ...review, id: Date.now(), votes: 0 });
  localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
}

export function voteReview(bookId: string, reviewId: number, delta: number) {
  const reviews = getReviews(bookId);
  const updated = reviews.map((r) => 
    r.id === reviewId ? { ...r, votes: r.votes + delta } : r
  );
  localStorage.setItem(`reviews_${bookId}`, JSON.stringify(updated));
}