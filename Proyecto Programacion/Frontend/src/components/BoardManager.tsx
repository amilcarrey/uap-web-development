import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TabsContainer } from "./TabsContainer";
import { TabContent } from "./TabContent";
import { ShareBoardModal } from "./ShareBoardModal"; // Importar el modal
import { TestModal } from "./TestModal"; // Importar modal de prueba
import { ShareBoardModalFixed } from "./ShareBoardModalFixed"; // Importar modal arreglado
import { ShareBoardModalComplete } from "./ShareBoardModalComplete"; // Modal completo
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

  // 🔥 Log para monitorear cambios de estado del modal
  useEffect(() => {
    console.log('🔄 BoardManager: Estado del modal cambió - isShareModalOpen:', isShareModalOpen, 'shareModalBoardId:', shareModalBoardId);
  }, [isShareModalOpen, shareModalBoardId]);

  const { boardId: boardTitleParam } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  // Crear tablero
  const handleAddTab = () => {
    const title = `Tablero ${tabs.length + 1}`;
    if (createTab) {
      createTab.mutate(title, {
        onSuccess: (newTab) => {
          toast.success("Tablero creado");
          navigate(`/board/${encodeURIComponent(newTab.title)}`);
        },
        onError: () => {
          toast.error("Error al crear el tablero");
        }
      });
    }
  };

  // Eliminar tablero
  const handleRemoveTab = (id: string) => {
    console.log('handleRemoveTab llamado con id:', id);
    console.log('deleteTab objeto:', deleteTab);

    deleteTab.mutate(id, {
      onSuccess: () => {
        const removedTab = tabs.find(tab => tab.id === id);
        toast.success(`Tablero "${removedTab ? removedTab.title : id}" eliminado`);
        const remaining = tabs.filter(tab => tab.id !== id);
        if (removedTab && boardTitleParam === removedTab.title && remaining.length > 0) {
          navigate(`/board/${encodeURIComponent(remaining[0].title)}`);
        } else if (remaining.length === 0) {
          navigate('/');
        }
      },
      onError: (error) => {
        console.error('Error en eliminación:', error);
        toast.error("Error al eliminar el tablero");
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
    console.log('🔄 BoardManager: handleShareTab llamado con id:', id);
    console.log('🔄 BoardManager: Estado antes del cambio - isShareModalOpen:', isShareModalOpen, 'shareModalBoardId:', shareModalBoardId);
    
    setShareModalBoardId(id);
    setShareModalOpen(true);
    
    console.log('🔄 BoardManager: handleShareTab ejecutado - debería abrir modal');
  };

  // Cerrar modal de compartir
  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setShareModalBoardId(null);
  };

  const activeTab = tabs.find(tab => tab.title === boardTitleParam);

  if (isLoading) return <div>Cargando tableros...</div>;

  // Log para depurar renderizado del modal
  console.log('🔄 BoardManager: Renderizando componente');
  console.log('🔄 BoardManager: isShareModalOpen:', isShareModalOpen);
  console.log('🔄 BoardManager: shareModalBoardId:', shareModalBoardId);
  console.log('🔄 BoardManager: ¿Debería renderizar modal?', isShareModalOpen && shareModalBoardId);

  return (
    <>
      {/* 🔥 BOTÓN DE PRUEBA TEMPORAL */}
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm mb-2">🔧 Panel de pruebas:</p>
        <button
          onClick={() => {
            console.log('🔥 Botón de prueba clickeado');
            setShareModalBoardId('test-board-123');
            setShareModalOpen(true);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded mr-2"
        >
          🔥 Abrir Modal (Prueba Directa)
        </button>
        <span className="text-xs">
          Modal abierto: {isShareModalOpen ? 'SÍ' : 'NO'} | 
          BoardId: {shareModalBoardId || 'ninguno'}
        </span>
      </div>

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
        <ShareBoardModalComplete
          boardId={shareModalBoardId}
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
        />
      )}
    </>
  );
}