// app/book/[volumeId]/page.tsx
import Image from 'next/image';
import { getVolume, bestImage } from '@/lib/googleBooks';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

export default async function BookDetailPage({ params }: { params: { volumeId: string } }) {
  const book = await getVolume(params.volumeId);
  const v = book.volumeInfo;
  const img = bestImage(v);
  const isbn = v.industryIdentifiers?.find((i) => i.type.includes('ISBN'))?.identifier;

  return (
    <article className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[200px,1fr]">
        <div className="space-y-3">
          <div className="relative h-[280px] w-[200px] overflow-hidden rounded-xl border bg-neutral-100">
            {img ? <Image src={img} alt={v.title ?? ''} fill sizes="200px" className="object-cover" /> : null}
          </div>
          <div className="text-xs text-neutral-500">
            {isbn ? <>ISBN: <span className="font-mono">{isbn}</span></> : null}
          </div>
        </div>

        <div className="space-y-4">
          <header>
            <h1 className="text-3xl font-bold leading-tight">{v.title}</h1>
            <p className="text-neutral-600">{v.authors?.join(', ') ?? 'Autor desconocido'}</p>
            <p className="text-sm text-neutral-500 mt-1">
              {v.publisher} {v.publisher && '·'} {v.publishedDate} {v.pageCount ? `· ${v.pageCount} págs` : ''}
            </p>
            {v.categories?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {v.categories.map((c) => (
                  <span key={c} className="rounded-full border px-3 py-1 text-xs text-neutral-600 bg-neutral-50">
                    {c}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {v.description ? (
            <section className="prose max-w-none prose-neutral">
              <h2 className="text-lg font-semibold">Descripción</h2>
              <p className="whitespace-pre-line">{v.description}</p>
            </section>
          ) : (
            <p className="text-neutral-600">Este libro no tiene descripción disponible.</p>
          )}
        </div>
      </div>

      {/* Reseñas locales */}
      <section className="space-y-4">
        <ReviewForm volumeId={params.volumeId} />
        <ReviewList volumeId={params.volumeId} />
      </section>

      <div>
        <a
          href={`/search?q=${encodeURIComponent(v.title ?? '')}`}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-neutral-50"
        >
          ← Volver a resultados
        </a>
      </div>
    </article>
  );
}
