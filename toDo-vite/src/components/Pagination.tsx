import { usePaginationStore } from "../stores/usePaginationStore";

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
    const{page, nextPage, prevPage} = usePaginationStore();
    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => prevPage()}
                className="cursor-pointer  p-2 border-2 border-blue-500 rounded-md hover:text-blue-700"
            >
                Anterior
            </button>
            <span className="text-white">
                Página {page} de {totalPages}
            </span>
             <button
                onClick={() => nextPage()}
                disabled={page === totalPages}
                className="cursor-pointer  p-2 border-2 border-blue-500 rounded-md hover:text-blue-700"
            >
                Siguiente
            </button>

            


        </div>
    )

}