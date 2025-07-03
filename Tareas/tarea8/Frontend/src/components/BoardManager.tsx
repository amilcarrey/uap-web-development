import { useParams, useNavigate } from "react-router-dom";
import { TabsContainer } from "./TabsContainer";
import { TabContent } from "./TabContent";
import { ShareBoardModalComplete } from "./ShareBoardModalComplete";
import { ShareModalErrorBoundary } from "./ShareModalErrorBoundary";
import { useTabs, useCreateTab, useDeleteTab, useRenameTab } from "../hooks/tabs";
import { useUIStore } from "../stores/uiStore";
import toast from 'react-hot-toast';

// Maneja la lógica de tableros: agregar, borrar, renombrar y compartir
export function BoardManager() {
  const { data: tabs = [], isLoading } = useTabs();
  const createTab = useCreateTab();
  const deleteTab = useDeleteTab();
  const renameTab = useRenameTab();

  const isShareModalOpen = useUIStore(state => state.isShareModalOpen);
  const shareModalBoardId = useUIStore(state => state.shareModalBoardId);
  const setShareModalOpen = useUIStore(state => state.setShareModalOpen);
  const setShareModalBoardId = useUIStore(state => state.setShareModalBoardId);

  const { boardId: boardTitleParam } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const handleAddTab = () => {
    const title = `Tablero ${tabs.length + 1}`;
    if (createTab) {
      createTab.mutate(title, {
        onSuccess: (newTab) => {
          toast.success("Nuevo tablero listo");
          navigate(`/board/${encodeURIComponent(newTab.title)}`);
        },
        onError: (error) => {
          toast.error(`No se pudo crear el tablero: ${error.message}`);
        }
      });
    }
  };

  const handleRemoveTab = (id: string) => {
    deleteTab.mutate(id, {
      onSuccess: () => {
        const removedTab = tabs.find(tab => tab.id === id);
        toast.success(`Tablero "${removedTab?.title || id}" borrado`);
        const remaining = tabs.filter(tab => tab.id !== id);
        if (removedTab && boardTitleParam === removedTab.title && remaining.length > 0) {
          navigate(`/board/${encodeURIComponent(remaining[0].title)}`);
        } else if (remaining.length === 0) {
          navigate('/');
        }
      },
      onError: (error) => {
        toast.error(`No se pudo borrar: ${error.message}`);
      }
    });
  };

  const handleRenameTab = (id: string, newTitle: string) => {
    if (renameTab) {
      renameTab.mutate({ id, newTitle }, {
        onSuccess: (updatedTab) => {
          toast.success("Nombre cambiado");
          navigate(`/board/${encodeURIComponent(updatedTab.title || newTitle)}`);
        },
        onError: () => {
          toast.error("No se pudo cambiar el nombre");
        }
      });
    }
  };

  const handleShareTab = (id: string) => {
    setShareModalBoardId(id);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setShareModalBoardId(null);
  };

  const activeTab = tabs.find(tab => tab.title === boardTitleParam);

  if (isLoading) return <div>Loading...</div>;

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
        onShareTab={handleShareTab}
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
