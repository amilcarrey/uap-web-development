import type { Categoria } from "../types";
import { useParams } from "@tanstack/react-router";

type CategoryButtonsProps = {
  categorias: Categoria[]; 
  onAddCategoria: (name: string) => void; 
  onDeleteCategoria: (id: string) => void; 
};

export default function CategoryButtons({
  categorias,
  onAddCategoria,
  onDeleteCategoria,
}: CategoryButtonsProps) {
  const { categoriaId } = useParams({ from: "/categorias/$categoriaId" }); // Obtiene el categoriaId actual desde la URL

  return (
    <div className="flex items-center justify-center p-1 bg-[antiquewhite] space-x-4 w-full h-[60px]">
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          className={`text-[20px] font-bold bg-[antiquewhite] px-3 py-1.5 cursor-pointer hover:text-[rgb(120,118,0)] ${
            categoriaId === categoria.id ? "border-b-[3px] border-[rgb(64,0,83)] text-[rgb(64,0,83)]" : "hover:border-b-[3px] hover:border-[rgb(64,0,83)]"
          }`}
          onClick={() => (window.location.href = `/categorias/${categoria.id}`)} // Navega a la categoría seleccionada
        >
          {categoria.name}
        </button>
      ))}

      <button
        className={`text-[20px] font-bold bg-[antiquewhite] px-3 py-1.5 cursor-pointer hover:text-[rgb(120,118,0)] ${
          categoriaId === 'configuraciones' ? "border-b-[3px] border-[rgb(64,0,83)] text-[rgb(64,0,83)]" : "hover:border-b-[3px] hover:border-[rgb(64,0,83)]"
        }`}
        onClick={() => (window.location.href = '/settings')}
      >
        Configuraciones
      </button>

     <button
  onClick={() => onAddCategoria("")} 
  className="text-[20px] text-white bg-orange-400 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-[rgb(139,90,0)]"
>
  +
</button>

      <button
  onClick={() => onDeleteCategoria("")} // Llama a la función para abrir el modal de confirmación
  className="text-[20px] text-white bg-orange-400 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-red-600"
>
  -
</button>
    </div>
  );
}