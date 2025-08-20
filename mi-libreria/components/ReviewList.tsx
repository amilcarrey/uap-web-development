'use client';

import { useMemo, useState, useEffect } from 'react';
import { voteReview, getReviews } from '../lib/review.locals';

function useReviews(volumeId: string) {
  const [reviews, setReviews] = useState<any[]>(() => getReviews(volumeId));
  useEffect(() => {
    function refresh() {
      setReviews(getReviews(volumeId));
    }
    refresh();
    const handler = (e: any) => {
      if (!e.detail || e.detail.volumeId === volumeId) refresh();
    };
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
        <h3 className="text-lg font-semibold text-gray-900">Reseñas de la comunidad</h3>
        <div className="text-sm text-gray-600">
          Ordenar:
          <button
            className={`ml-2 underline underline-offset-4 ${order === 'top' ? 'font-semibold text-violet-700' : ''}`}
            onClick={() => setOrder('top')}
          >
            Más útiles
          </button>
          <button
            className={`ml-2 underline underline-offset-4 ${order === 'new' ? 'font-semibold text-violet-700' : ''}`}
            onClick={() => setOrder('new')}
          >
            Recientes
          </button>
        </div>
      </div>

      {!sorted.length ? (
        <p className="rounded-xl border border-violet-100 bg-white/70 p-4 text-gray-600">
          No hay reseñas todavía en este dispositivo.
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((r) => (
            <li key={r.id} className="rounded-2xl border border-violet-100 bg-white/80 p-4 shadow-sm">
              <div className="text-xs text-gray-500">
                {r.rating}★ · {new Date(r.createdAt).toLocaleString()}
              </div>
              <p className="mt-1 text-gray-900">{r.content}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <button
                  className="rounded-lg border border-violet-200 px-2 py-1 text-gray-700 hover:bg-[#ede6ff] transition"
                  onClick={() => {
                    voteReview(volumeId, r.id, 1);
                    window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
                  }}
                >
                  👍 {r.up}
                </button>
                <button
                  className="rounded-lg border border-violet-200 px-2 py-1 text-gray-700 hover:bg-[#ede6ff] transition"
                  onClick={() => {
                    voteReview(volumeId, r.id, -1);
                    window.dispatchEvent(new CustomEvent('reviews-changed', { detail: { volumeId } }));
                  }}
                >
                  👎 {r.down}
                </button>
                <span className="text-gray-500">Score: {r.up - r.down}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
