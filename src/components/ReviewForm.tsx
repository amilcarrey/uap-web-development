import React, { useState } from 'react'
import { StarRating } from './StarRating'

export interface ReviewFormProps {
  bookId: string
  onSubmit: (data: { bookId: string; rating: number; text: string }) => Promise<void> | void
}

export function ReviewForm({ bookId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isValid = rating >= 1 && text.trim().length >= 10

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isValid) {
      setError('Calificación y reseña (mín. 10 caracteres) son obligatorios.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ bookId, rating, text: text.trim() })
      setRating(0)
      setText('')
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <fieldset disabled={submitting} className="space-y-2">
        <legend className="font-semibold">Tu calificación</legend>
        <StarRating value={rating} onChange={setRating} />
      </fieldset>

      <div>
        <label htmlFor="review-text" className="block font-semibold mb-1">
          Tu reseña
        </label>
        <textarea
          id="review-text"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe al menos 10 caracteres..."
          className="w-full border rounded p-2"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {submitting ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  )
}