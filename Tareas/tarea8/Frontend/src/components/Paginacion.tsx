type PaginacionProps = {
    page: number;        // Número de la página actual
    setPage: (page: number) => void; // Función para cambiar la página
    hasNext: boolean;   // Indica si hay una página siguiente
    hasPrev: boolean;   // Indica si hay una página anterior
}

export function Paginacion({page, setPage, hasNext, hasPrev} : PaginacionProps) {
    return(
        <div className="flex justify-center my-4">
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border">
                <button 
                    onClick={() => setPage(page-1)} 
                    disabled={!hasPrev}
                    className={`px-3 py-1 rounded transition-colors ${
                        hasPrev 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    ← Anterior
                </button>
                
                <span className="text-sm font-medium text-gray-700">
                    Página {page}
                </span>
                
                <button 
                    onClick={() => setPage(page+1)} 
                    disabled={!hasNext}
                    className={`px-3 py-1 rounded transition-colors ${
                        hasNext 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Siguiente →
                </button>
            </div>
        </div>
    );
}