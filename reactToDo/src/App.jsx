import { useState, useMemo } from 'react';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';
import NotificationList from './components/NotificationList';
import BoardSwitcher from './components/BoardSwitcher';
import BoardModal from './components/BoardModal';
import { useClientStore } from './stores/clientStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('');
  const [filter, setFilter] = useState('all');
  const { activeBoard, boards } = useClientStore();

  // Encuentra el board activo y sus categorías
  const board = useMemo(() => boards.find(b => b.id === activeBoard), [boards, activeBoard]);
  const categories = board?.categories || [];

  // Si no hay boards, muestra solo el modal para crear uno
  if (!activeBoard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <BoardSwitcher />
        <BoardModal />
        <p className="text-gray-500 mt-4">Crea un board para comenzar.</p>
      </div>
    );
  }

  // Si no hay tab activo, selecciona el primero
  if (!activeTab && categories.length > 0) {
    setActiveTab(categories[0]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <NotificationList />
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>
          
          <BoardSwitcher />
          
          <Tabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            tabs={categories}
          />
          
          <AddTask category={activeTab} />
          
          <TaskFilters 
            currentFilter={filter}
            onFilterChange={setFilter}
            category={activeTab}
            boardId={activeBoard}
          />
          
          <TaskList 
            category={activeTab}
            filter={filter}
            boardId={activeBoard}
          />
        </div>
      </div>
      
      <BoardModal />
    </div>
  );
}