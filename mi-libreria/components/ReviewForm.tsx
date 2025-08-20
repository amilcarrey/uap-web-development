'use client';

import { useState } from 'react';
import { z } from 'zod';
import { createReview } from '../lib/review.locals';

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
        createReview(volumeId, parsed.data);
        (e.currentTarget as HTMLFormElement).reset();
        setError(undefined);
        setOk(true);
        window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
      }}
      className="rounded-2xl border border-violet-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm space-y-3"
    >
      <div className="flex gap-3">
        <select
          name="rating"
          defaultValue="5"
          className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
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
          className="flex-1 rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-violet-700">¡Reseña publicada en este dispositivo!</p>}

      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-white text-sm font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-md active:scale-[.99] transition"
      >
        Publicar reseña
      </button>
    </form>
  );
}
