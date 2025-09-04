import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBookById } from '../api/googleBooks'
import type { BookDetail } from '../types/bookDetail'
import { fetchReviews, postReview, voteReview } from '../api/reviews'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewList, type Review } from '../components/ReviewList'
export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<BookDetail | null>(null)

  // <-- Aquí indicamos que reviews es un array de Review
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!id) return

    getBookById(id).then(setBook)

    fetchReviews(id)
      .then(res => {
        // TS sabe que res.data es Review[]
        setReviews(res.data)
      })
      .catch(err => {
        console.error('Error cargando reseñas', err)
      })
  }, [id])

  function handleNewReview(data: Omit<Review, 'id' | 'upVotes' | 'downVotes'>) {
    postReview(data)
      .then(() => fetchReviews(id!))
      .then(res => setReviews(res.data))
      .catch(err => {
        console.error('Error añadiendo reseña', err)
      })
  }

  function handleVote(
    reviewId: number,
    delta: Partial<Pick<Review, 'upVotes' | 'downVotes'>>
  ) {
    voteReview(reviewId, delta)
      .then(() => {
        setReviews(current =>
          current.map(r =>
            r.id === reviewId ? { ...r, ...delta } : r
          )
        )
      })
      .catch(err => {
        console.error('Error actualizando voto', err)
      })
  }

  if (!book) {
    return <p className="p-6">Cargando detalle…</p>
  }

  const info = book.volumeInfo
  const cover = info.imageLinks?.large || info.imageLinks?.thumbnail

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex gap-6">
        {cover && (
          <img
            src={cover}
            alt={info.title}
            className="w-48 object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="text-gray-600">{info.authors?.join(', ')}</p>
          <p className="mt-2 text-sm text-gray-500">
            {info.publishedDate} · {info.pageCount} páginas ·{' '}
            {info.categories?.join(', ')}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
        <p>{info.description}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">
          Reseñas de la comunidad
        </h2>
        <ReviewList reviews={reviews} onVote={handleVote} />
        <ReviewForm bookId={id!} onSubmit={handleNewReview} />
      </section>
    </div>
  )
}