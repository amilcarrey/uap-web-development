// src/components/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6 p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-pink-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition"
      >
        Anterior
      </button>
      
      <span className="text-pink-700 font-medium">
        Página {currentPage} de {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-pink-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition"
      >
        Siguiente
      </button>
    </div>
  );
}
