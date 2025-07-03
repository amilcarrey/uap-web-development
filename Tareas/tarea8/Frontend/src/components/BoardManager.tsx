import { useParams, useNavigate } from "react-router-dom";
import { TabsContainer } from "./TabsContainer";
import { TabContent } from "./TabContent";
import { ShareBoardModalComplete } from "./ShareBoardModalComplete"; // Modal completo
import { ShareModalErrorBoundary } from "./ShareModalErrorBoundary"; // Error boundary
import { useTabs, useCreateTab, useDeleteTab, useRenameTab } from "../hooks/tabs";
import { useUIStore } from "../stores/uiStore"; // Importar el store UI
import toast from 'react-hot-toast';

export function BoardManager() {
  const { data: tabs = [], isLoading } = useTabs();
  const createTab = useCreateTab();
  const deleteTab = useDeleteTab();
  const renameTab = useRenameTab();

  // Estados del modal de compartir
  const isShareModalOpen = useUIStore(state => state.isShareModalOpen);
  const shareModalBoardId = useUIStore(state => state.shareModalBoardId);
  const setShareModalOpen = useUIStore(state => state.setShareModalOpen);
  const setShareModalBoardId = useUIStore(state => state.setShareModalBoardId);

  const { boardId: boardTitleParam } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  // Crear tablero
  const handleAddTab = () => {
    const title = `Tablero ${tabs.length + 1}`;
    
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

  // Eliminar tablero
  const handleRemoveTab = (id: string) => {
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

  // Renombrar tablero
  const handleRenameTab = (id: string, newTitle: string) => {
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

  // Compartir tablero
  const handleShareTab = (id: string) => {
    setShareModalBoardId(id);
    setShareModalOpen(true);
  };

  // Cerrar modal de compartir
  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setShareModalBoardId(null);
  };

  const activeTab = tabs.find(tab => tab.title === boardTitleParam);

  if (isLoading) return <div>Cargando tableros...</div>;

  return (
    <>
      <TabsContainer
        tabs={tabs}
        activeTab={activeTab?.id ?? ""}
        setActiveTab={tabId => {
          const tab = tabs.find(t => t.id === tabId);
          if (tab) {
            navigate(`/board/${encodeURIComponent(tab.title)}`);
          }
        }}
        onAddTab={handleAddTab}
        onRemoveTab={handleRemoveTab}
        onShareTab={handleShareTab} // Agregar callback de compartir
      />
      
      {activeTab && (
        <TabContent
          key={activeTab.id}
          tabId={activeTab.id}
          title={activeTab.title}
          isActive={true}
          onRenameTab={handleRenameTab}
        />
      )}

      {/* Modal de compartir */}
      {isShareModalOpen && shareModalBoardId && (
        <ShareModalErrorBoundary>
          <ShareBoardModalComplete
            boardId={shareModalBoardId}
            boardTitle={tabs.find(tab => tab.id === shareModalBoardId)?.title}
            isOpen={isShareModalOpen}
            onClose={handleCloseShareModal}
          />
        </ShareModalErrorBoundary>
      )}
    </>
  );
}