import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { FilterControls } from './FilterControls';
import { TaskSearch } from './TaskSearch';
import { useTasks, useClearCompletedTasks } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useUserSettings } from '../hooks/userSettings';
import { useMemo, useState} from 'react';          
import { Paginacion } from './Paginacion';
import React from 'react';
import toast from 'react-hot-toast';
import type { Task } from '../types/task';

export interface Props {
  tabId: string;
  title: string;
  isActive: boolean;
  onRenameTab?: (id: string, newTitle: string) => void;
}

export function TabContent({
  tabId,
  title,
  isActive = false,
  onRenameTab,
}: Props) {
  const [page, setPage] = useState(1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [showSearch, setShowSearch] = useState(false);
  const [hideMainList, setHideMainList] = useState(false);

  const { data: userSettings } = useUserSettings();
  const limit = userSettings?.itemsPerPage || 10;

  React.useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleRename = () => {
    if(newTitle.trim() && newTitle !== title && onRenameTab) {
      onRenameTab(tabId, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const { data: tasks = [], isLoading, isError } = useTasks(tabId, page, limit);
  const { mutate: clearCompleted } = useClearCompletedTasks();

  const taskFilter = useUIStore(state => state.taskFilter);
  const setTaskFilter = useUIStore(state => state.setTaskFilter);

 const filteredTasks = useMemo(() => {
  if (taskFilter === "active") return tasks.filter((task: Task) => !task.active);
  if (taskFilter === "completed") return tasks.filter((task: Task) => task.active);
  return tasks;
}, [taskFilter, tasks]);


  return (
    <section
      id={tabId}
      className={`tab-content ${isActive ? 'active block' : 'hidden'}`}
    >
      {isEditingTitle ? (
        <input
          className="text-xl font-bold mb-2 px-2 py-1 rounded"
          value={newTitle}
          autoFocus
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsEditingTitle(false);
          }}
          onBlur={handleRename}
        /> 
      ):(
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
            title="Haz clic para renombrar"
          >
            {title}
          </h3>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title={showSearch ? "Ocultar búsqueda" : "Buscar tareas"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>{showSearch ? "Ocultar búsqueda" : "Buscar"}</span>
          </button>
        </div>
      )}
  
      {showSearch && (
        <TaskSearch 
          tabId={tabId} 
          onHideMainList={setHideMainList}
        />
      )}

      <TaskInput tabId={tabId} onTaskAdded={() => {}} />

      {!hideMainList && (
        <>
          {isLoading ? (
            <div>Cargando tareas...</div>
          ) : isError ? (
            <div>Error al cargar tareas</div>
          ) : (
            <>
              <TaskList tasks={filteredTasks} tabId={tabId} isLoading={isLoading} />
              <Paginacion 
                page={page} 
                setPage={setPage} 
                hasNext={tasks.length === limit}
                hasPrev={page > 1} 
              />
            </>
          )}
        </>
      )}

      {!hideMainList && (
        <FilterControls
          tabId={tabId}
          currentFilter={taskFilter}
          onFilterChange={setTaskFilter}
          onClearCompleted={() => {
            clearCompleted(tabId, {
              onSuccess: () => toast.success("Tareas completadas eliminadas"),
              onError: () => toast.error("No se pudieron limpiar las tareas completadas"),
            });
          }}
        />
      )}
    </section>
  );
}
