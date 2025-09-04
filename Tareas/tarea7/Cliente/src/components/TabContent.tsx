import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { FilterControls } from './FilterControls';
import { useTasks, useClearCompletedTasks } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useMemo, useState } from 'react';          
import { Paginacion } from './Paginacion';
import React from 'react';
import toast from 'react-hot-toast';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

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
  const [limit, setLimit] = useState(5);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

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
  if (taskFilter === "active") return tasks.filter((task: Task) => !task.completed);
  if (taskFilter === "completed") return tasks.filter((task: Task) => task.completed);
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
        <h3
          className="text-xl font-bold mb-2 cursor-pointer"
          onClick={() => setIsEditingTitle(true)}
          title="Haz clic para renombrar"
        >
          {title}
        </h3>
      )}
  

      <TaskInput tabId={tabId} onTaskAdded={() => {}} />

      {isLoading ? (
        <div>Cargando tareas...</div>
      ) : isError ? (
        <div>Error al cargar tareas</div>
      ) : (
        <>
          <TaskList tasks={filteredTasks} tabId={tabId} />
          <Paginacion page={page} setPage={setPage} hasNext={filteredTasks.length === limit} hasPrev={page > 1} limit={limit} setLimit={setLimit}/>
        </>
      )}

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
    </section>
  );
}
