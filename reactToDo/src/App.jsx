import { useState, useMemo, useEffect } from 'react';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';
import NotificationList from './components/NotificationList';
import BoardSwitcher from './components/BoardSwitcher';
import BoardModal from './components/BoardModal';
import Settings from './components/Settings';
import { useClientStore } from './stores/clientStore';
import AuthForm from './components/AuthForm';

export default function App() {
  const [activeTab, setActiveTab] = useState('');
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { activeBoard, boards } = useClientStore();

  useEffect(() => {
    fetch('http://localhost:4000/api/tasks', { credentials: 'include' })
      .then(res => setIsAuthenticated(res.ok));
  }, []);

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

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowSettings(false)}
        >
          Volver
        </button>
        <Settings />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <NotificationList />
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">Task Manager</h1>
            <button
              className="ml-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowSettings(true)}
            >
              ⚙️
            </button>
          </div>
          
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