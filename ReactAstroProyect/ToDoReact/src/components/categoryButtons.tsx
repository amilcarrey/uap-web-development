import type { Categoria } from "../types";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import ShareCategoryModal from "./shareModal";

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

    // estado para modal de compartir
  const [shareModalOpen, setShareModalOpen] = useState<{ id: string; name: string } | null>(null);

  const handleShareCategory = () => {
    if (categoriaId) {
      const categoria = categorias.find(cat => cat.id === categoriaId);
      if (categoria) {
        setShareModalOpen({ id: categoria.id, name: categoria.name });
      }
    }
  };

  // agregar colores por diferentes permisos en cada cat7egoria
  const getCategoryStyles = (categoria: Categoria, isActive: boolean) => {
    const baseClasses = "text-[20px] font-bold px-3 py-1.5 cursor-pointer transition-all duration-200";
    
    // Si no es compartida (categoría propia)
    if (!categoria.isShared) {
      return `${baseClasses} bg-[antiquewhite] hover:text-[rgb(120,118,0)] ${
        isActive 
          ? "border-b-[3px] border-[rgb(64,0,83)] text-[rgb(64,0,83)]" 
          : "hover:border-b-[3px] hover:border-[rgb(64,0,83)]"
      }`;
    }

    // Si es compartida, aplicar colores según rol
    let colorClasses = "";
    switch (categoria.userRole) {
      case 'owner':
        colorClasses = isActive 
          ? "bg-green-100 border-b-[3px] border-green-700 text-green-800" 
          : "bg-green-50 text-green-700 hover:bg-green-300 hover:border-b-[3px] hover:border-green-500";
        break;
      case 'editor':
        colorClasses = isActive 
          ? "bg-orange-100 border-b-[3px] border-red-700 text-orange-800" 
          : "bg-orange-50 text-orange-700 hover:bg-red-300 hover:border-b-[3px] hover:border-orange-500";
        break;
      case 'viewer':
        colorClasses = isActive 
          ? "bg-blue-100 border-b-[3px] border-blue-700 text-blue-800" 
          : "bg-blue-50 text-blue-700 hover:bg-blue-300 hover:border-b-[3px] hover:border-blue-500";
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-600";
    }

    return `${baseClasses} ${colorClasses}`;
  };
  return (
    <div className="flex items-center justify-center p-1 bg-[antiquewhite] space-x-4 w-full h-[60px]">
      {categorias.map((categoria) => (
        <div key={categoria.id} className="relative">
          <button
            className={getCategoryStyles(categoria, categoriaId === categoria.id)}
            onClick={() => (window.location.href = `/categorias/${categoria.id}`)}
          >
            {categoria.name}
            {/*Indicador visual de rol */}
            {categoria.isShared && (
              <span className="ml-1 text-xs opacity-75">
                {categoria.userRole === 'owner' && '👑'}
                {categoria.userRole === 'editor' && '✏️'}
                {categoria.userRole === 'viewer' && '👁️'}
              </span>
            )}
          </button>
        </div>
      ))}

      <button
        className={`text-[20px] font-bold bg-[antiquewhite] px-3 py-1.5 cursor-pointer hover:text-[rgb(120,118,0)] ${
          categoriaId === 'configuraciones' ? "border-b-[3px] border-[rgb(64,0,83)] text-[rgb(64,0,83)]" : "hover:border-b-[3px] hover:border-[rgb(64,0,83)]"
        }`}
        onClick={() => (window.location.href = '/settings')}
      >
        Configuraciones
      </button>

      {/*Botón compartir solo para owners */}
      {categoriaId && categoriaId !== 'configuraciones' && (
        (() => {
          const currentCategory = categorias.find(cat => cat.id === categoriaId);
          // Solo mostrar si es owner (ya sea propia o compartida como owner)
          return (currentCategory?.userRole === 'owner' || !currentCategory?.isShared) && (
            <button
              onClick={handleShareCategory}
              className="text-[20px] text-white bg-blue-500 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-blue-600 transition-colors"
              title="Compartir tablero"
            >
              <i className="fas fa-share"></i>
            </button>
          );
        })()
      )}

      <button
          onClick={() => onAddCategoria("")} 
          className="text-[20px] text-white bg-orange-400 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-[rgb(139,90,0)]">
          +
      </button>

      <button
        onClick={() => onDeleteCategoria("")} // Llama a la función para abrir el modal de confirmación
        className="text-[20px] text-white bg-orange-400 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-red-600">
        -
      </button>

      {/* Modal de compartir categoría */}
      {shareModalOpen && (
          <ShareCategoryModal
          categoryId={shareModalOpen.id}
          categoryName={shareModalOpen.name}
          onClose={() => setShareModalOpen(null)}
        />
      )}
    </div>
  );
}