//Client Component para el buscador
// components/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SearchBar({ placeholder = 'Título, autor o ISBN' }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(() => params.get('q') ?? '');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border px-4 py-2.5 pr-10 shadow-sm focus:outline-none pastel-title bg-[#f7f3ff]"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pastel-author">⌘K</span>
      </div>
      <button
        type="submit"
        className="rounded-xl border px-4 py-2.5 pastel-title hover:bg-[#ede6ff] shadow-sm"
      >
        Buscar
      </button>
    </form>
  );
}
