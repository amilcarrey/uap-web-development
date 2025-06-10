import { useClientStore } from '../store/clientStore';

interface PaginacionProps {
  totalPaginas: number;
}

export default function Paginacion({ totalPaginas }: PaginacionProps) {
  const { paginaActual, setPaginaActual } = useClientStore();

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Anterior
      </button>
      
      <span className="px-4 py-2">
        Página {paginaActual} de {totalPaginas}
      </span>
      
      <button
        onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Siguiente
      </button>
    </div>
  );
}