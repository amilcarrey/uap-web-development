import { useParams, useNavigate } from "react-router-dom";
import { TabsContainer } from "./TabsContainer";
import { TabContent } from "./TabContent";
import { useTabs, useCreateTab, useDeleteTab, useRenameTab } from "../hooks/tabs";
import toast from 'react-hot-toast';

export function BoardManager() {
  const { data: tabs = [], isLoading } = useTabs();
  const createTab = useCreateTab();
  const deleteTab = useDeleteTab();
  const renameTab = useRenameTab();

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

  const activeTab = tabs.find(tab => tab.title === boardTitleParam);

  if (isLoading) return <div>Cargando tableros...</div>;

  return (
    <>

      <TabsContainer
        tabs={tabs}
        activeTab={activeTab?.id ?? ""}
        setActiveTab={tabId => {
          // Buscar la pestaña por ID y navegar usando su título
          const tab = tabs.find(t => t.id === tabId);
          if (tab) {
            navigate(`/board/${encodeURIComponent(tab.title)}`);
          }
        }}
        onAddTab={handleAddTab}
        onRemoveTab={handleRemoveTab}
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
    </>
  );
}