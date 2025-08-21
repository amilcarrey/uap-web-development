'use client';

import { useEffect, useState } from 'react';
import type { Review } from '@/types';

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          aria-label={`${n} estrellas`}
          className="text-2xl leading-none"
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ bookId }: { bookId: string }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [user, setUser] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews/${bookId}`, { cache: 'no-store' });
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [bookId]);

  const submit = async () => {
    if (!user.trim() || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/reviews/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, rating, text }),
      });
      if (res.ok) {
        setUser(''); setText(''); setRating(5);
        await load();
      } else {
        alert('Error creando reseña');
      }
    } finally {
      setSending(false);
    }
  };

  const vote = async (reviewId: string, delta: 1 | -1) => {
    const res = await fetch(`/api/reviews/${bookId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, delta }),
    });
    if (res.ok) {
      // actualiza en memoria sin recargar todo
      const updated = await res.json();
      setItems((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Reseñas</h2>

      {/* Formulario */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Tu nombre o alias"
            className="rounded-lg border px-3 py-2"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Calificación:</span>
            <Stars value={rating} onChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu reseña…"
            className="rounded-lg border px-3 py-2 sm:col-span-2"
            rows={3}
          />
        </div>
        <div className="mt-3">
          <button
            onClick={submit}
            disabled={sending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {sending ? 'Enviando…' : 'Publicar reseña'}
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p>Cargando reseñas…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-600">Sé la primera persona en reseñar este libro.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li key={r.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <strong>{r.user}</strong>
                    <span className="text-sm text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-amber-500"><Stars value={r.rating} /></div>
                  <p className="mt-1 whitespace-pre-wrap">{r.text}</p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => vote(r.id, 1)}
                    className="rounded-md border px-2 py-1 hover:bg-green-50"
                    aria-label="Like"
                  >
                    👍
                  </button>
                  <span className="w-10 text-center font-semibold text-green-700">{r.likes ?? 0}</span>
                  <button
                    onClick={() => vote(r.id, -1)}
                    className="rounded-md border px-2 py-1 hover:bg-red-50"
                    aria-label="Dislike"
                  >
                    👎
                  </button>
                  <span className="w-10 text-center font-semibold text-red-700">{r.dislikes ?? 0}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
