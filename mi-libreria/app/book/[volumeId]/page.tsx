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
  <article className="space-y-8 pastel-card p-6">
  <div className="grid gap-8 md:grid-cols-[200px,1fr]">
        <div className="space-y-3">
          <div className="relative h-[280px] w-[200px] overflow-hidden rounded-xl border bg-[#ede6ff]">
            {img ? <Image src={img} alt={v.title ?? ''} fill sizes="200px" className="object-cover" /> : null}
          </div>
          <div className="text-xs pastel-date">
            {isbn ? <>ISBN: <span className="font-mono">{isbn}</span></> : null}
          </div>
        </div>

        <div className="space-y-4">
          <header>
            <h1 className="text-3xl font-bold leading-tight pastel-title">{v.title}</h1>
            <p className="pastel-author">{v.authors?.join(', ') ?? 'Autor desconocido'}</p>
            <p className="text-sm pastel-date mt-1">
              {v.publisher} {v.publisher && '·'} {v.publishedDate} {v.pageCount ? `· ${v.pageCount} págs` : ''}
            </p>
            {v.categories?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {v.categories.map((c) => (
                  <span key={c} className="rounded-full border px-3 py-1 text-xs pastel-author bg-[#f7f3ff]">
                    {c}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {v.description ? (
            <section className="prose max-w-none">
              <h2 className="text-lg font-semibold pastel-title">Descripción</h2>
              <p className="whitespace-pre-line pastel-desc">{v.description}</p>
            </section>
          ) : (
            <p className="pastel-author">Este libro no tiene descripción disponible.</p>
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
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 pastel-title hover:bg-[#ede6ff]"
        >
          ← Volver a resultados
        </a>
      </div>
    </article>
  );
}
