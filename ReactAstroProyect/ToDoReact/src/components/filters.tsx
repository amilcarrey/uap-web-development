import { useParams, useSearch } from "@tanstack/react-router";
import {useState} from "react";

function FiltersButtons() {
  const { categoriaId } = useParams({ from: "/categorias/$categoriaId" }); // Obtiene el categoriaId de la URL
  const search = useSearch({ from: "/categorias/$categoriaId" }); // Obtiene los parámetros de búsqueda
  const filtro = search.filtro || "all"; // Obtiene el filtro actual, por defecto "all"
  const [searchTerm, setSearchTerm] = useState('');

  //FUNCIÓN: de buscar tareas
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Mantener filtro actual y agregar bsuqueda
      const searchParams = new URLSearchParams();
      if (filtro !== "all") searchParams.set("filtro", filtro);
      searchParams.set("search", searchTerm.trim());
      
      window.location.href = `/categorias/${categoriaId}?${searchParams.toString()}`;
    }
  };


  return (
    <div className="filterContainer flex justify-center gap-[20px] m-[20px]">
      <a
        href={`/categorias/${categoriaId}?filtro=all`}
        className={`filterButtons rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer ${
          filtro === "all" ? "bg-orange-400 text-white underline" : "bg-gray-300 hover:bg-[rgb(139,90,0)]"
        }`}
      >
        Todas
      </a>
      <a
        href={`/categorias/${categoriaId}?filtro=completadas`}
        className={`filterButtons rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer ${
          filtro === "completadas" ? "bg-orange-400 text-white underline" : "bg-gray-300 hover:bg-[rgb(139,90,0)]"
        }`}
      >
        Completadas
      </a>
      <a
        href={`/categorias/${categoriaId}?filtro=pendientes`}
        className={`filterButtons rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer ${
          filtro === "pendientes" ? "bg-orange-400 text-white underline" : "bg-gray-300 hover:bg-[rgb(139,90,0)]"
        }`}
      >
        Pendientes
      </a>
            <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchTerm ? searchTerm : "Buscar tareas..."} 
          className="pl-10 pr-4 py-[10px] border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
        
        {/* Lupita clickeable */}
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
}

export default FiltersButtons;
