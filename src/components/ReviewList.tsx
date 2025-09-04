export interface Review {
  id: number
  bookId: string
  rating: number
  text: string
  upVotes: number
  downVotes: number
}

export interface ReviewListProps {
  reviews: Review[]
  onVote: (
    reviewId: number,
    delta: Partial<Pick<Review, 'upVotes' | 'downVotes'>>
  ) => void
}

export function ReviewList({ reviews, onVote }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-600">
        Sé el primero en dejar una reseña.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            {/* Estrellas según el rating */}
            <div>
              <span className="font-semibold text-yellow-400">
                {[...Array(review.rating)].map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </span>
              <span className="text-gray-500"> /5</span>
            </div>

            {/* Botones de voto */}
            <div className="flex gap-2 text-sm">
              <button
                aria-label={`Upvote review ${review.id}`}
                onClick={() =>
                  onVote(review.id, { upVotes: review.upVotes + 1 })
                }
                className="px-2 bg-green-100 rounded hover:bg-green-200"
              >
                👍 {review.upVotes}
              </button>
              <button
                aria-label={`Downvote review ${review.id}`}
                onClick={() =>
                  onVote(review.id, { downVotes: review.downVotes + 1 })
                }
                className="px-2 bg-red-100 rounded hover:bg-red-200"
              >
                👎 {review.downVotes}
              </button>
            </div>
          </div>

          {/* Texto de la reseña */}
          <p className="text-gray-800">{review.text}</p>
        </li>
      ))}
    </ul>
  )
}