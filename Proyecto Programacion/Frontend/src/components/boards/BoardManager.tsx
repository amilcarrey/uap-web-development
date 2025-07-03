import { useParams } from "react-router-dom";
import { TabsContainer } from "./TabsContainer";
import { TabContent } from "./TabContent";
import { ShareBoardModalComplete } from "../sharing/ShareBoardModalComplete";
import { ShareModalErrorBoundary } from "../sharing/ShareModalErrorBoundary";
import { useTabs } from "../../hooks/tabs";
import { useBoardOperations } from "../../hooks/useBoardOperations";
import { useShareModal } from "../../hooks/useShareModal";

export function BoardManager() {
  const { data: tabs = [], isLoading } = useTabs();
  const { boardId: boardTitleParam } = useParams<{ boardId: string }>();
  
  // Hook para operaciones de tableros (CRUD + navegación)
  const {
    createBoard,
    removeBoard,
    renameBoard,
    navigateToBoard
  } = useBoardOperations(tabs, boardTitleParam);
  
  // Hook para gestión del modal de compartir
  const {
    isShareModalOpen,
    shareModalBoardId,
    openShareModal,
    closeShareModal
  } = useShareModal();

  const activeTab = tabs.find(tab => tab.title === boardTitleParam);

  if (isLoading) return <div>Cargando tableros...</div>;

  return (
    <>
      <TabsContainer
        tabs={tabs}
        activeTab={activeTab?.id ?? ""}
        setActiveTab={navigateToBoard}
        onAddTab={createBoard}
        onRemoveTab={removeBoard}
        onShareTab={openShareModal}
      />
      
      {activeTab && (
        <TabContent
          key={activeTab.id}
          tabId={activeTab.id}
          title={activeTab.title}
          isActive={true}
          onRenameTab={renameBoard}
        />
      )}

      {/* Modal de compartir */}
      {isShareModalOpen && shareModalBoardId && (
        <ShareModalErrorBoundary>
          <ShareBoardModalComplete
            boardId={shareModalBoardId}
            boardTitle={tabs.find(tab => tab.id === shareModalBoardId)?.title}
            isOpen={isShareModalOpen}
            onClose={closeShareModal}
          />
        </ShareModalErrorBoundary>
      )}
    </>
  );
}