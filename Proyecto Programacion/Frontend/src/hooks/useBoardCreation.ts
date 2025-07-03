import { useNavigate } from 'react-router-dom';
import { useCreateTab, useTabs } from './tabs';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para manejar la lógica de creación de tableros
 * Separa la lógica de negocio del componente App.tsx
 */
export function useBoardCreation() {
  const createTab = useCreateTab();
  const navigate = useNavigate();
  const { data: tabs = [] } = useTabs();

  /**
   * Crea un nuevo tablero con título personalizado o automático
   */
  const createBoard = async (customTitle?: string) => {
    const title = customTitle || `Tablero ${tabs.length + 1}`;
    
    return new Promise((resolve, reject) => {
      createTab.mutate(title, {
        onSuccess: (newTab) => {
          try {
            toast.success("Tablero creado");
            // Navegar al nuevo tablero
            navigate(`/board/${encodeURIComponent(newTab.title)}`);
            resolve(newTab);
          } catch (error) {
            console.error('❌ Error en navegación después de crear tablero:', error);
            toast.error("Tablero creado pero hubo un error de navegación");
            reject(error);
          }
        },
        onError: (error) => {
          console.error('❌ Error al crear tablero:', error);
          toast.error(`Error al crear el tablero: ${error.message}`);
          reject(error);
        }
      });
    });
  };

  /**
   * Crea el primer tablero del usuario (caso especial)
   */
  const createFirstBoard = () => {
    return createBoard("Tablero 1");
  };

  return {
    createBoard,
    createFirstBoard,
    isCreating: createTab.isPending,
    tabs
  };
}
