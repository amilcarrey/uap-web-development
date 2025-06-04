import { useState } from "react";

type PaginacionProps = {
    page: number;        // Número de la página actual
    setPage: (page: number) => void; // Función para cambiar la página
    hasNext: boolean;   // Indica si hay una página siguiente
    hasPrev: boolean;   // Indica si hay una página anterior
    limit: number; // Número de elementos por página
    setLimit:(limit: number) => void; // Función para cambiar el límite de elementos por página
}

export function Paginacion({page, setPage, hasNext, hasPrev, limit, setLimit} : PaginacionProps) {
    const [inputValue, setInputValue] = useState(limit);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue > 0) setLimit(inputValue);
        }
    };

    return(
        <div className="flex justify-between my-2">
            <div className="flex items-center gap-5">
                <button onClick={() => setPage(page-1)} disabled={!hasPrev}>Anterior</button>
                <span> Página {page}</span>
                <button onClick={() => setPage(page+1)} disabled={!hasNext}>Siguiente</button>
            </div>
            <div>
                <label>
                    Tareas por página:&nbsp;
                    <input
                        className="px-3 py-1 text-base border border-gray-300 rounded placeholder:text-sm placeholder:italic"
                        type="number"
                        min={1}
                        //value={inputValue}
                        placeholder="Ingrese el número"
                        onChange={e => setInputValue(Number(e.target.value))}
                        onKeyDown={handleKeyDown}
                        style={{ width: "150px" }}
                    />
                </label>
            </div>
        
        
        </div>

        
    );
}