// src/app/search/page.tsx
import Link from "next/link";
import { searchBooks } from "@/lib/googleBooks";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; start?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const startIndex = Math.max(0, Number(searchParams.start ?? "0"));

  if (!q) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-900">
        <section className="w-full max-w-2xl mx-auto space-y-6 bg-neutral-950/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-neutral-800 text-center">
          <h2 className="text-3xl font-extrabold text-indigo-300 drop-shadow">Búsqueda</h2>
          <p className="text-neutral-300">Ingresá un término de búsqueda.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            Ir al inicio
          </Link>
        </section>
      </main>
    );
  }

  const { items, totalItems } = await searchBooks(q, startIndex);
  const count = items.length;
  const from = totalItems ? startIndex + 1 : 0;
  const to = Math.min(startIndex + count, totalItems ?? 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-900">
      <section className="w-full max-w-6xl mx-auto bg-neutral-950/80 rounded-2xl shadow-2xl border border-neutral-800 p-6 md:p-10 mt-10 mb-16">
        {/* Encabezado */}
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow">
              Resultados para “{q}”
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              {totalItems?.toLocaleString()} resultados
              {count > 0 && (
                <span className="text-neutral-500"> · Mostrando {from}-{to}</span>
              )}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm md:text-base font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            Nueva búsqueda
          </Link>
        </header>

        {/* Sin resultados */}
        {count === 0 && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
            <p className="text-neutral-300">No se encontraron resultados.</p>
            <p className="text-neutral-500 text-sm mt-2">
              Probá con otro título, autor o <code className="bg-neutral-800 px-2 py-1 rounded">isbn:978...</code>
            </p>
          </div>
        )}

        {/* Grid de resultados */}
        {count > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => {
              const info = v.volumeInfo ?? {};
              const thumb =
                info.imageLinks?.thumbnail ??
                info.imageLinks?.small ??
                info.imageLinks?.smallThumbnail ??
                "";

              return (
                <li
                  key={v.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 transition shadow-sm"
                >
                  <Link
                    href={`/book/${v.id}?q=${encodeURIComponent(q)}&start=${startIndex}`}
                    className="flex gap-4 p-4"
                  >
                    {/* Portada */}
                    <div
                      className="relative w-[88px] shrink-0 rounded-xl border border-neutral-800 bg-neutral-900"
                      style={{ aspectRatio: "2 / 3" }}
                    >
                      {thumb ? (
                        // Nota: si Google devuelve http:, habilitá dominios/https en next.config o usá <img>
                        <img
                          src={thumb}
                          alt={info.title ?? ""}
                          className="absolute inset-0 h-full w-full object-contain rounded-xl"
                          width={88}
                          height={132}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-800 text-[10px] text-neutral-300 px-1 text-center">
                          sin portada
                        </div>
                      )}
                    </div>

                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-100 line-clamp-2">
                        {info.title ?? "Sin título"}
                      </h3>
                      {!!info.authors?.length && (
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-1">
                          {info.authors.join(", ")}
                        </p>
                      )}
                      {info.description && (
                        <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
                          {info.description}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-neutral-500">
                        {info.publishedDate && <span>{info.publishedDate}</span>}
                        {info.categories?.length ? (
                          <>
                            {" "}
                            · <span>{info.categories[0]}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Paginación */}
        <nav className="flex items-center justify-between pt-8">
          {/* Anterior */}
          <Link
            aria-disabled={startIndex === 0}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
              startIndex === 0
                ? "border-neutral-800 bg-neutral-900/40 text-neutral-600 cursor-not-allowed pointer-events-none"
                : "border-neutral-700 hover:bg-neutral-900 text-neutral-200"
            }`}
            href={`/search?q=${encodeURIComponent(q)}&start=${Math.max(0, startIndex - 20)}`}
          >
            ← Anterior
          </Link>

          {/* Siguiente */}
          <Link
            aria-disabled={!!(totalItems && startIndex + count >= totalItems)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
              totalItems && startIndex + count >= totalItems
                ? "border-neutral-800 bg-neutral-900/40 text-neutral-600 cursor-not-allowed pointer-events-none"
                : "border-neutral-700 hover:bg-neutral-900 text-neutral-200"
            }`}
            href={`/search?q=${encodeURIComponent(q)}&start=${startIndex + 20}`}
          >
            Siguiente →
          </Link>
        </nav>
      </section>
    </main>
  );
}
