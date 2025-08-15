// Client Component con reseñas
// components/ReviewList.tsx
'use client';

import { useMemo, useState, useSyncExternalStore, useEffect } from 'react';
// import { getReviews, voteReview } from '../lib/review.locals';

function useReviews(volumeId: string) {
  const [reviews, setReviews] = useState<any[]>([]);
  async function fetchReviews() {
    const res = await fetch(`/api/reviews?volumeId=${volumeId}`);
    if (res.ok) setReviews(await res.json());
  }
  useEffect(() => { fetchReviews(); }, [volumeId]);
  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.volumeId === volumeId) fetchReviews(); };
    window.addEventListener('reviews-changed', handler);
    return () => window.removeEventListener('reviews-changed', handler);
  }, [volumeId]);
  return reviews;
}

export default function ReviewList({ volumeId }: { volumeId: string }) {
  const reviews = useReviews(volumeId);
  const [order, setOrder] = useState<'top' | 'new'>('top');

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (order === 'top') copy.sort((a, b) => (b.up - b.down) - (a.up - a.down));
    else copy.sort((a, b) => b.createdAt - a.createdAt);
    return copy;
  }, [reviews, order]);

  return (
  <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold pastel-title">Reseñas de la comunidad</h3>
        <div className="text-sm pastel-author">
          Ordenar:
          <button
            className={`ml-2 underline ${order === 'top' ? 'font-bold' : ''}`}
            onClick={() => setOrder('top')}
          >
            Más útiles
          </button>
          <button
            className={`ml-2 underline ${order === 'new' ? 'font-bold' : ''}`}
            onClick={() => setOrder('new')}
          >
            Recientes
          </button>
        </div>
      </div>

      {!sorted.length ? (
  <p className="rounded-xl border pastel-card p-4 pastel-author">
          No hay reseñas todavía en este dispositivo.
        </p>
      ) : (
  <ul className="space-y-3">
          {sorted.map((r) => (
            <li key={r.id} className="pastel-card p-4">
              <div className="text-sm pastel-date">
                {r.rating}★ · {new Date(r.createdAt).toLocaleString()}
              </div>
              <p className="mt-1 pastel-title">{r.content}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <button
                  className="rounded-lg border px-2 py-1 pastel-author hover:bg-[#ede6dd]"
                  onClick={async () => {
                    await fetch('/api/reviews/vote', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ volumeId, reviewId: r.id, delta: 1 })
                    });
                    window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
                  }}
                >
                  👍 {r.up}
                </button>
                <button
                  className="rounded-lg border px-2 py-1 pastel-author hover:bg-[#ede6dd]"
                  onClick={async () => {
                    await fetch('/api/reviews/vote', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ volumeId, reviewId: r.id, delta: -1 })
                    });
                    window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
                  }}
                >
                  👎 {r.down}
                </button>
                <span className="pastel-date">Score: {r.up - r.down}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
