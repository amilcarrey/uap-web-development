import { Review } from '@/types'

interface ReviewListProps {
  reviews: Review[];
  onVote: (reviewId: string, increment: number) => void;
}

export default function ReviewList({ reviews, onVote }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-gray-500">No hay reseñas todavía. Sé el primero en opinar.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">Reseñas de la comunidad</h3>
      <div className="space-y-4">
        {reviews
          .sort((a, b) => b.votes - a.votes)
          .map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{review.author}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onVote(review.id, 1)}
                    className="text-gray-400 hover:text-green-500"
                    title="Votar a favor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                    {review.votes}
                  </span>
                  <button
                    onClick={() => onVote(review.id, -1)}
                    className="text-gray-400 hover:text-red-500"
                    title="Votar en contra"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9a2 2 0 01-2 2h-2M17 4h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 15H14" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
      </div>
    </div>
  )
}