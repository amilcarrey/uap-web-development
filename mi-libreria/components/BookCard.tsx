// components/BookCard.tsx
import Image from 'next/image';
import type { Volume } from '@/lib/googleBooks';
import { bestImage } from '@/lib/googleBooks';

export default function BookCard({ v }: { v: Volume }) {
  const info = v.volumeInfo;
  const img = bestImage(info);

  return (
    <a
      href={`/book/${v.id}`}
      className="group rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4"
    >
      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
        {img ? (
          <Image src={img} alt={info.title ?? ''} fill sizes="80px" className="object-cover" />
        ) : null}
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold leading-tight group-hover:underline">{info.title ?? 'Sin título'}</h3>
        <p className="text-sm text-neutral-600 line-clamp-1">
          {info.authors?.join(', ') ?? 'Autor desconocido'}
        </p>
        {info.categories?.length ? (
          <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{info.categories.join(' • ')}</p>
        ) : null}
      </div>
    </a>
  );
}
