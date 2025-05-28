type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export function Pagination({ page, totalPages, setPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="px-4">
        Página {page} de {totalPages}
      </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
