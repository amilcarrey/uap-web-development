// src/hooks/useBoardOperations.ts
import { useNavigate } from "react-router-dom";
import { useCreateTab, useDeleteTab, useRenameTab } from "./tabs";
import { generateUniqueBoardName } from "../utils/boardValidation";
import toast from 'react-hot-toast';
import type { Tab } from "./tabs";

/**
 * Hook personalizado para operaciones de tableros
 * Encapsula toda la lógica de negocio relacionada con CRUD de tableros
 * y navegación entre tableros
 */
export function useBoardOperations(tabs: Tab[], boardTitleParam?: string) {
  const navigate = useNavigate();
  const createTab = useCreateTab();
  const deleteTab = useDeleteTab();
  const renameTab = useRenameTab();

  /**
   * Crea un nuevo tablero con un nombre autogenerado
   */
  const createBoard = () => {
    const existingNames = tabs.map(tab => tab.title);
    const title = generateUniqueBoardName(existingNames);
    
    if (createTab) {
      createTab.mutate(title, {
        onSuccess: (newTab) => {
          try {
            toast.success("Tablero creado");
            navigate(`/board/${encodeURIComponent(newTab.title)}`);
          } catch (error) {
            console.error('❌ Error en navegación después de crear tablero:', error);
            toast.error("Tablero creado pero hubo un error de navegación");
          }
        },
        onError: (error) => {
          console.error('❌ Error al crear tablero:', error);
          toast.error(`Error al crear el tablero: ${error.message}`);
        }
      });
    }
  };

  /**
   * Elimina un tablero y navega al siguiente disponible
   */
  const removeBoard = (id: string) => {
    deleteTab.mutate(id, {
      onSuccess: () => {
        try {
          const removedTab = tabs.find(tab => tab.id === id);
          toast.success(`Tablero "${removedTab ? removedTab.title : id}" eliminado`);
          
          const remaining = tabs.filter(tab => tab.id !== id);
          if (removedTab && boardTitleParam === removedTab.title && remaining.length > 0) {
            navigate(`/board/${encodeURIComponent(remaining[0].title)}`);
          } else if (remaining.length === 0) {
            navigate('/');
          }
        } catch (error) {
          console.error('❌ Error en navegación después de eliminar tablero:', error);
          toast.error("Tablero eliminado pero hubo un error de navegación");
        }
      },
      onError: (error) => {
        console.error('❌ Error al eliminar tablero:', error);
        toast.error(`Error al eliminar el tablero: ${error.message}`);
      }
    });
  };

  /**
   * Renombra un tablero y actualiza la URL
   */
  const renameBoard = (id: string, newTitle: string) => {
    if (renameTab) {
      renameTab.mutate({ id, newTitle }, {
        onSuccess: (updatedTab) => {
          toast.success("Tablero renombrado");
          navigate(`/board/${encodeURIComponent(updatedTab.title || newTitle)}`);
        },
        onError: () => {
          toast.error("Error al renombrar el tablero");
        }
      });
    }
  };

  /**
   * Navega a un tablero específico
   */
  const navigateToBoard = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(`/board/${encodeURIComponent(tab.title)}`);
    }
  };

  return {
    createBoard,
    removeBoard, 
    renameBoard,
    navigateToBoard
  };
}
