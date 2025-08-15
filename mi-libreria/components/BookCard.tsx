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
      className="group pastel-card p-4 flex gap-4 hover:scale-[1.03] transition-transform"
    >
  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md bg-[#ede6ff]">
        {img ? (
          <Image src={img} alt={info.title ?? ''} fill sizes="80px" className="object-cover" />
        ) : null}
      </div>

      <div className="min-w-0">
        <h3 className="pastel-title font-semibold leading-tight group-hover:underline">{info.title ?? 'Sin título'}</h3>
        <p className="text-sm pastel-author line-clamp-1">
          {info.authors?.join(', ') ?? 'Autor desconocido'}
        </p>
        {info.categories?.length ? (
          <p className="mt-1 text-xs pastel-date line-clamp-1">{info.categories.join(' • ')}</p>
        ) : null}
      </div>
    </a>
  );
}
