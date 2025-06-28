//src\components\TabContent.tsx

import { TaskInput } from './TaskInput';            // Componente para ingresar nuevas tareas
import { TaskList } from './TaskList';              // Componente que muestra la lista de tareas
import { FilterControls } from './FilterControls';  // Componente para cambiar el filtro (ver todas, completadas, etc.)
import { TaskSearch } from './TaskSearch'; // Agregar import
import { useTasks, useClearCompletedTasks } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useMemo, useState } from 'react';          
import { Paginacion } from './Paginacion';
import React from 'react';
import toast from 'react-hot-toast';

// Estructura base de una tarea: un identificador, un texto y si está completada o no
export interface Task {
  id: string;
  content: string;
  active: boolean;
}

// Props que recibe el componente TabContent, una por cada pestaña de tareas
export interface Props {
  tabId: string;                // ID único de la pestaña (para identificarla y filtrarla)
  title: string;               // Título que se muestra en la UI
  isActive: boolean;           // Indica si esta pestaña está visible o no
  onRenameTab?: (id: string, newTitle: string) => void; // Callback opcional para renombrar la pestaña
}


/**
 * Componente TabContent
 * Este componente representa el contenido de una pestaña de tareas.
 * Utiliza React Query para obtener las tareas desde el backend y Zustand para manejar el filtro global de tareas.
 * Muestra el input para agregar tareas, la lista filtrada de tareas y los controles de filtro.
 * El filtro de tareas (todas, completadas, activas) es global y compartido entre todas las pestañas.
 */
export function TabContent({
  tabId,
  title,
  isActive = false,
  onRenameTab,
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Número de tareas a mostrar por página (En el backen el numero por defecto es 10, en el caso de que no se envíe el parámetro limit, se usa el valor por defecto del backend)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [showSearch, setShowSearch] = useState(false); // Nuevo estado para mostrar búsqueda

  //Si cambia el titulo desde fuera, sincroniza el input con el nuevo título
  React.useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleRename = () => {
    if(newTitle.trim() && newTitle !== title && onRenameTab) {
      onRenameTab(tabId, newTitle.trim()); // Llama al callback para renombrar la pestaña
    }
    setIsEditingTitle(false); // Cierra el modo edición
  };


  // Obtiene las tareas de la pestaña actual usando React Query.
  // Si no hay datos, se usa un array vacío por defecto.
  const { data: tasks = [], isLoading, isError } = useTasks(tabId, page, limit);
  const { mutate: clearCompleted } = useClearCompletedTasks();

  //console.log("TabContent", tabId, tasks);

  /*
   Zustand store para manejar el filtro global de tareas.
   - useUIStore es un hook que accede al estado global de la UI.
   - taskFilter es el filtro actual ('all', 'active', 'completed').
   - setTaskFilter es la función para cambiar el filtro.
   
   Esta parte permite que todas las pestañas compartan el mismo filtro de tareas,
   y se actualice en tiempo real cuando el usuario cambia el filtro.
   Obtiene el filtro global de tareas y la función para cambiarlo desde Zustand.
   taskFilter puede ser 'all', 'active' o 'completed'.
  */
  const taskFilter = useUIStore(state => state.taskFilter);
  const setTaskFilter = useUIStore(state => state.setTaskFilter);

  /*
   Filtra las tareas según el filtro global seleccionado.
   - 'active': solo muestra tareas no completadas
   - 'completed': solo muestra tareas completadas
   - 'all': muestra todas las tareas
  */
 const filteredTasks = useMemo(() => {
  if (taskFilter === "active") return tasks.filter((task: Task) => !task.active);
  if (taskFilter === "completed") return tasks.filter((task: Task) => task.active);
  return tasks; // Por defecto, devuelve todas las tareas si no hay filtro
}, [taskFilter, tasks]);


  return (
    <section
      id={tabId}
      // Solo muestra el contenido si la pestaña está activa
      className={`tab-content ${isActive ? 'active block' : 'hidden'}`}
    >
      {/* Título de la pestaña editable*/}
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
          {/* Botón para mostrar/ocultar búsqueda */}
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
  
      {/* Componente de búsqueda */}
      {showSearch && <TaskSearch tabId={tabId} />}

      {/* Input para agregar nuevas tareas */}
      <TaskInput tabId={tabId} onTaskAdded={() => {}} />

      {/* Muestra un mensaje de carga o error, o la lista de tareas filtradas */}
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

      {/* Controles para cambiar el filtro de tareas */}
      <FilterControls
        tabId={tabId}
        currentFilter={taskFilter}
        onFilterChange={setTaskFilter}
        onClearCompleted={() => {
          //console.log('Limpiar completadas', tabId);
          clearCompleted(tabId, {
            onSuccess: () => toast.success("Tareas completadas eliminadas"),
            onError: () => toast.error("No se pudieron limpiar las tareas completadas"),
          });
        }}
      />
    </section>
  );
}
