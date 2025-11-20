'use client';

import { useEffect, useMemo, useState } from 'react';
import { ReadingListEntry, ReadingStats } from '../types';

type ApiResult<T> = { result?: T; error?: string };

const fetchTool = async <T,>(tool: string, payload: Record<string, unknown>): Promise<ApiResult<T>> => {
  const res = await fetch(`/api/tools/${tool}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return { error: error?.error || 'No se pudo completar la acción' };
  }
  const data = await res.json();
  return { result: data.result };
};

const priorityLabel: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export function ReadingDashboard() {
  const [list, setList] = useState<ReadingListEntry[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const [listResponse, statsResponse] = await Promise.all([
      fetchTool<{ items: ReadingListEntry[] }>('getReadingList', { filter: 'all', limit: 20 }),
      fetchTool<{ stats: ReadingStats }>('getReadingStats', { period: 'all-time', groupBy: 'genre' }),
    ]);

    if (listResponse.error) setError(listResponse.error);
    if (statsResponse.error) setError(statsResponse.error);

    setList(listResponse.result?.items ?? []);
    setStats(statsResponse.result?.stats ?? null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const topGenres = useMemo(
    () =>
      stats
        ? Object.entries(stats.genres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, value]) => `${name} (${value})`)
        : [],
    [stats],
  );

  const topAuthors = useMemo(
    () =>
      stats
        ? Object.entries(stats.authors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, value]) => `${name} (${value})`)
        : [],
    [stats],
  );

  return (
    <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#050816]/95 via-[#030817] to-[#01030b] p-6 text-slate-50 shadow-[0_25px_70px_rgba(3,8,23,0.85)] backdrop-blur-xl">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-200">Panel orbital</p>
          <h2 className="text-2xl font-black text-white">Control de lecturas</h2>
          <p className="text-sm text-slate-300">
            Sincroniza la lista, historial y métricas almacenadas en SQLite. Cada cambio desde el chat se refleja aquí.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow shadow-cyan-500/20 transition hover:border-cyan-400/60 hover:bg-cyan-400/20"
        >
          Actualizar
        </button>
      </header>

      {error && (
        <p className="mt-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100 shadow-inner shadow-rose-500/20">
          {error}
        </p>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Libros procesados" value={stats?.totalRead ?? 0} accent="from-cyan-500/30 via-cyan-500/10 to-transparent" />
        <StatCard label="Páginas estimadas" value={stats?.totalPages ?? 0} accent="from-violet-500/30 via-violet-500/10 to-transparent" />
        <StatCard label="Racha activa" value={stats?.streakDays ?? 0} accent="from-amber-500/30 via-amber-500/10 to-transparent" suffix="días" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-5 shadow-inner shadow-black/30">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Lista de lectura</h3>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Prioridades, notas y estado</p>
            </div>
            {loading && (
              <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">
                Cargando…
              </span>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {list.length === 0 && <p className="text-sm text-white/60">Aún no has agregado libros.</p>}
            {list.map((item) => (
              <article
                key={`${item.bookId}-${item.addedAt}`}
                className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4 shadow shadow-black/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 text-sm text-slate-200">
                    <p className="text-base font-semibold text-white">{item.title || 'Título no disponible'}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                      {item.authors?.join(', ') || 'Autores no disponibles'}
                    </p>
                    <p className="text-xs text-white/40">Guardado: {new Date(item.addedAt).toLocaleDateString()}</p>
                    {item.notes && <p className="text-xs text-white/70">Notas: {item.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white">
                      {priorityLabel[item.priority] || 'Media'}
                    </span>
                    {item.status === 'read' && item.rating && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1 text-[11px] font-semibold text-amber-100">
                        {item.rating}/5 ⭐
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-950/70 via-slate-950/50 to-transparent p-5 shadow-inner shadow-indigo-900/40">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.35em] text-violet-200">Patrones</p>
            <h3 className="text-lg font-semibold text-white">Resumen de lectura</h3>
          </div>
          <div className="mt-4 space-y-4 text-sm text-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Promedio de rating</p>
              <div className="mt-2 h-3 rounded-full border border-white/10 bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
                  style={{ width: `${Math.min((stats?.averageRating ?? 0) * 20, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-base font-semibold text-white">{stats?.averageRating?.toFixed(2) ?? 'N/A'} / 5</p>
            </div>
            <p>
              📚 Géneros dominantes: <strong className="font-semibold text-white">{topGenres.join(' · ') || '—'}</strong>
            </p>
            <p>
              🧑‍💻 Autores frecuentes: <strong className="font-semibold text-white">{topAuthors.join(' · ') || '—'}</strong>
            </p>
            <p className="text-xs text-white/50">
              Los cálculos toman los datos de <code className="rounded bg-white/10 px-1 py-0.5">read_books</code> agrupados en backend.
            </p>
          </div>
          {loading && <p className="mt-3 text-xs text-white/50">Actualizando datos…</p>}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent, suffix }: { label: string; value: number; accent: string; suffix?: string }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${accent} p-4 text-white shadow-inner shadow-black/30`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">{label}</p>
      <p className="text-3xl font-black text-white">
        {value} {suffix && <span className="text-base font-semibold text-white/70">{suffix}</span>}
      </p>
    </div>
  );
}
