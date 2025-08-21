// src/app/book/[id]/page.tsx
import Link from "next/link";
import { getBook } from "@/lib/googleBooks";
import { getReviews } from "./actions";
import ReviewForm from "./_components/ReviewForm";  
import ReviewList from "./_components/ReviewList";
import { pickCover } from "@/lib/cover";

export default async function BookPage({ params, searchParams }: { params: { id: string }, searchParams: { q?: string; start?: string }; }) {
  const { id } = await params;
  const { q = "", start = "" } = await searchParams;
  
  const volume = await getBook(id);
  if (!volume) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-900">
        <section className="w-full max-w-4xl mx-auto space-y-6 bg-neutral-950/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-neutral-800">
          <p className="text-center text-neutral-300">No se encontró el libro.</p>
          <div className="text-center">
            <Link href={q ? `/search?q=${encodeURIComponent(q)}${start ? `&start=${start}` : ""}` : "/"} className="text-indigo-300 hover:text-indigo-200 font-semibold">
              {q ? "Volver a la búsqueda" : "Volver al inicio"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const info = volume.volumeInfo ?? {};
  const cover = pickCover(info.imageLinks);
  const isbn = (info.industryIdentifiers ?? []).find((x) => x.type?.includes("ISBN"));
  const reviews = await getReviews(id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-900">
      <section className="w-full max-w-5xl mx-auto bg-neutral-950/80 rounded-2xl shadow-2xl border border-neutral-800 p-6 md:p-10 mt-10 mb-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow">
            {info.title ?? "Sin título"}
          </h1>
          <Link
            href={q ? `/search?q=${encodeURIComponent(q)}${start ? `&start=${start}` : ""}` : "/"}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm md:text-base font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            Volver
          </Link>
        </div>

        {/* Contenido */}
        <article className="grid gap-10 md:grid-cols-2 items-start">
          {/* Portada */}
          <div className="flex md:justify-start justify-center">
            <div
              className="relative w-[360px] max-w-full rounded-2xl border border-neutral-800 bg-neutral-900 shadow-inner"
              style={{ aspectRatio: "2 / 3" }}
            >
              {cover ? (
                <img
                  src={cover}
                  alt={info.title ?? ""}
                  className="absolute inset-0 h-full w-full object-contain rounded-2xl"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-neutral-800 text-sm text-neutral-300">
                  sin portada
                </div>
              )}
            </div>
          </div>

          {/* Datos */}
          <div className="space-y-4">
            {info.authors?.length ? (
              <p className="text-neutral-300 text-lg">
                {(info.authors ?? []).join(", ")}
              </p>
            ) : null}

            <div className="text-sm text-neutral-400 leading-relaxed">
              {info.publisher && <span className="block"><span className="text-neutral-300">Editorial:</span> {info.publisher}</span>}
              {info.publishedDate && <span className="block"><span className="text-neutral-300">Fecha:</span> {info.publishedDate}</span>}
              {info.pageCount && <span className="block"><span className="text-neutral-300">Páginas:</span> {info.pageCount}</span>}
              {isbn && <span className="block"><span className="text-neutral-300">ISBN:</span> {isbn.identifier}</span>}
              {info.categories && (
                <span className="block">
                  <span className="text-neutral-300">Categorías:</span>{" "}
                  <span className="text-neutral-200">{info.categories.join(", ")}</span>
                </span>
              )}
            </div>

            {info.description && (
              <div className="prose prose-invert max-w-none">
                <h3 className="mt-6 font-semibold text-indigo-300">Descripción</h3>
                <div
                  className="leading-relaxed text-neutral-200"
                  dangerouslySetInnerHTML={{ __html: info.description }}
                />
              </div>
            )}
          </div>
        </article>

        {/* Divider */}
        <hr className="my-10 border-neutral-800" />

        {/* Reseñas */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-indigo-300">Reseñas</h2>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 md:p-6">
            <ReviewForm volumeId={id} />
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 md:p-6">
            <ReviewList volumeId={id} initial={reviews} />
          </div>
        </section>
      </section>
    </main>
  );
}
