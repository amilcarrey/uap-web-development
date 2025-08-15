//Client Component para añadir reseñas
// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';
// import { createReview } from '../lib/review.locals';

const FormSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  content: z.string().min(5).max(2000),
});

export default function ReviewForm({ volumeId }: { volumeId: string }) {
  const [error, setError] = useState<string>();
  const [ok, setOk] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const parsed = FormSchema.safeParse({
          rating: fd.get('rating'),
          content: fd.get('content'),
        });
        if (!parsed.success) {
          setError('Completá rating (1–5) y una reseña de al menos 5 caracteres.');
          return;
        }
        fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volumeId, ...parsed.data })
        });
        (e.currentTarget as HTMLFormElement).reset();
        setError(undefined);
        setOk(true);
        // avisar a la lista que hay cambios
        window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
      }}
      className="rounded-2xl border p-4 shadow-sm bg-white space-y-3"
    >
      <div className="flex gap-3">
        <select
          name="rating"
          defaultValue="5"
          className="rounded-xl border px-3 py-2"
          aria-label="Puntaje"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}★
            </option>
          ))}
        </select>
        <textarea
          name="content"
          rows={3}
          placeholder="Escribí tu reseña..."
          className="flex-1 rounded-xl border px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
  {ok && <p className="text-sm pastel-title">¡Reseña publicada en este dispositivo!</p>}

      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Publicar reseña
      </button>
    </form>
  );
}
