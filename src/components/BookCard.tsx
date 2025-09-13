import { useNavigate } from 'react-router-dom'
import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate()
  const { id, volumeInfo } = book
  const thumbnail = volumeInfo.imageLinks?.thumbnail

  return (
    <div
      className="flex cursor-pointer rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition"
      onClick={() => navigate(`/book/${id}`)}
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt={volumeInfo.title}
          className="w-24 object-cover"
        />
      )}
      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{volumeInfo.title}</h3>
        <p className="text-sm text-gray-600">
          {volumeInfo.authors?.join(', ')}
        </p>
      </div>
    </div>
  )
}