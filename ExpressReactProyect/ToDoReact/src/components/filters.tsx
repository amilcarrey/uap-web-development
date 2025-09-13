import { useParams, useSearch } from "@tanstack/react-router";

function FiltersButtons() {
  const { categoriaId } = useParams({ from: "/categorias/$categoriaId" }); // Obtiene el categoriaId de la URL
  const search = useSearch({ from: "/categorias/$categoriaId" }); // Obtiene los parámetros de búsqueda
  const filtro = search.filtro || "all"; // Obtiene el filtro actual, por defecto "all"

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
    </div>
  );
}

export default FiltersButtons;
