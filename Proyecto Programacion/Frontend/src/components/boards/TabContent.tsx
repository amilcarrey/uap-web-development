//src\components\boards\TabContent.tsx

import { TaskInput } from '../tasks/TaskInput';            // Componente para ingresar nuevas tareas
import { TaskList } from '../tasks/TaskList';              // Componente que muestra la lista de tareas
import { FilterControls } from '../tasks/FilterControls';  // Componente para cambiar el filtro (ver todas, completadas, etc.)
import { TaskSearch } from '../tasks/TaskSearch'; // Agregar import

import { useTasks, useClearCompletedTasks } from '../../hooks/task';
import { useUIStore } from '../../stores/uiStore';
import { useUserSettings } from '../../hooks/userSettings'; // Para obtener el límite de preferencias
import { useMemo, useState } from 'react';          
import { Paginacion } from '../tasks/Paginacion';
import React from 'react';
import toast from 'react-hot-toast';
import type { Task } from '../../types/task';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [showSearch, setShowSearch] = useState(false); // Nuevo estado para mostrar búsqueda
  const [hideMainList, setHideMainList] = useState(false); // Estado para ocultar la lista principal durante búsqueda

  // Obtener el límite de las preferencias del usuario
  const { data: userSettings } = useUserSettings();
  const limit = userSettings?.itemsPerPage || 10;

  //Si cambia el titulo desde fuera, sincroniza el input con el nuevo título
  React.useEffect(() => {
    setNewTitle(title);
  }, [title]);

  // Maneja el renombrado de la pestaña cuando el usuario presiona Enter o hace blur
  const handleRename = () => {
    if(newTitle.trim() && newTitle !== title && onRenameTab) {
      onRenameTab(tabId, newTitle.trim()); // Llama al callback para renombrar la pestaña
    }
    setIsEditingTitle(false); // Cierra el modo edición
  };


  // Obtiene las tareas de la pestaña actual usando React Query.
  // Si no hay datos, se usa un array vacío por defecto.
  // El límite se obtiene de las preferencias del usuario y se pasa explícitamente.
  const { data: tasks = [], isLoading, isError } = useTasks(tabId, page, limit);
  const { mutate: clearCompleted } = useClearCompletedTasks();

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
      {isEditingTitle ? ( // Modo edición del título
        <input
          className="text-xl font-bold mb-2 px-2 py-1 rounded"
          value={newTitle}
          autoFocus
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename(); // Renombra al presionar Enter
            if (e.key === 'Escape') setIsEditingTitle(false);// Sale del modo edición al presionar Escape
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
      {showSearch && (
        <TaskSearch 
          tabId={tabId} 
          onHideMainList={setHideMainList}
        />
      )}

      {/* Input para agregar nuevas tareas */}
      <TaskInput tabId={tabId} onTaskAdded={() => {}} />

      {/* Muestra un mensaje de carga o error, o la lista de tareas filtradas */}
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
                hasNext={tasks.length === limit} // Si el backend devolvió exactamente 'limit' tareas, probablemente hay más
                hasPrev={page > 1} 
              />
            </>
          )}
        </>
      )}

      {/* Controles para cambiar el filtro de tareas - Solo mostrar si no hay búsqueda activa */}
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

      {/* Componente para mostrar información de debugging */}
    </section>
  );
}
