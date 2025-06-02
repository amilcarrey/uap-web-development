import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import ToastContainer from './ToastContainer';
import BoardSelector from './BoardSelector';
import { SettingsForm } from './SettingsForm';
import { getBoards, createBoard } from '../../services/boardService';
import { getTodosByBoard, createTodo, updateTodo, deleteTodo } from '../../services/todoService';
import useUIStore from '../../hooks/useUIStore';
import useToast from '../../hooks/useToast';
import { useSettingsStore } from '../../stores/settingsStore';

const queryClient = new QueryClient();

const TodoApp = () => {
  const { 
    activeFilter, 
    setActiveFilter, 
    activeCategory, 
    setActiveCategory,
    isLoading,
    setLoading,
    error,
    setError,
    clearError,
    currentPage,
    itemsPerPage,
    setCurrentPage
  } = useUIStore();

  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const { showUppercase } = useSettingsStore();

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      loadTodos(selectedBoard);
    } else {
      setTodos([]);
    }
  }, [selectedBoard]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0].id);
      }
    } catch (err) {
      setError('Error al cargar tableros');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (name) => {
    try {
      setLoading(true);
      const newBoard = await createBoard({ name });
      setBoards(prev => [...prev, newBoard]);
      setSelectedBoard(newBoard.id);
      showSuccess('Tablero creado');
    } catch (err) {
      showError('Error al crear tablero');
    } finally {
      setLoading(false);
    }
  };

  const loadTodos = async (boardId) => {
    try {
      setLoading(true);
      const data = await getTodosByBoard(boardId);
      setTodos(data);
      clearError();
      showSuccess('Tareas cargadas correctamente');
    } catch (err) {
      setError('Error al cargar tareas. Por favor recarga la página.');
      showError('Error al cargar las tareas');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text, category = 'personal') => {
    if (!text || !text.trim()) {
      showError('El texto de la tarea no puede estar vacío');
      return;
    }
    if (!selectedBoard) {
      showError('Selecciona un tablero primero');
      return;
    }
    try {
      const newTodo = await createTodo(selectedBoard, { text: text.trim(), category });
      setTodos(prev => [...prev, newTodo]);
      clearError();
      showSuccess('Tarea agregada correctamente');
    } catch (err) {
      showError('Error al añadir tarea');
      console.error('Error añadiendo tarea:', err);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const updatedTodo = await updateTodo(id, { 
        completed: !todoToUpdate.completed 
      });
      
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
      showSuccess(`Tarea ${updatedTodo.completed ? 'completada' : 'marcada como pendiente'}`);
    } catch (err) {
      showError('Error al actualizar tarea');
      console.error('Error actualizando tarea:', err);
    }
  };

  const handleRemoveTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      showSuccess('Tarea eliminada correctamente');
    } catch (err) {
      showError('Error al eliminar tarea');
      console.error('Error eliminando tarea:', err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      if (completedTodos.length === 0) {
        showInfo('No hay tareas completadas para eliminar');
        return;
      }

      setLoading(true);
      
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id))
      );
      
      const errors = results.filter(result => result.status === 'rejected');
      
      if (errors.length > 0) {
        console.error('Errores al eliminar tareas:', errors);
        showWarning(`Se eliminaron ${completedTodos.length - errors.length} tareas, pero ${errors.length} fallaron`);
      } else {
      setTodos(prev => prev.filter(todo => !todo.completed));
        showSuccess('Todas las tareas completadas fueron eliminadas');
      }
    } catch (err) {
      showError('Error al eliminar tareas completadas');
      console.error('Error eliminando tareas completadas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = async (text, category) => {
    if (!editingTodo) return;
    try {
      const updated = await updateTodo(editingTodo.id, { text, category });
      setTodos(prev => prev.map(todo => todo.id === editingTodo.id ? updated : todo));
      setEditingTodo(null);
      showSuccess('Tarea editada correctamente');
    } catch (err) {
      showError('Error al editar la tarea');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const filteredTodos = todos.filter(todo => {
    const categoryMatch = 
      activeCategory === 'all' || 
      todo.category === activeCategory;
    
    const statusMatch = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && !todo.completed) || 
      (activeFilter === 'completed' && todo.completed);
    
    return categoryMatch && statusMatch;
  });

  // Calcular los índices para la paginación
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const personalCount = todos.filter(todo => todo.category === 'personal').length;
  const universidadCount = todos.filter(todo => todo.category === 'universidad').length;

  return (
    <QueryClientProvider client={queryClient}>
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <BoardSelector
          boards={boards}
          selectedBoard={selectedBoard}
          onCreateBoard={handleCreateBoard}
          onSelectBoard={setSelectedBoard}
        />
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          title="Configuraciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SettingsForm onClose={() => setShowSettings(false)} />
        </div>
      )}

      {error && (
          <ErrorMessage 
            message={error} 
            onClose={clearError}
          />
      )}
      
      <div className="flex flex-wrap space-x-2 md:space-x-4 justify-center">
        <CategoryButton 
          active={activeCategory === 'all'} 
          onClick={() => setActiveCategory('all')}
          count={todos.length}
        >
          Todas
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'personal'} 
          onClick={() => setActiveCategory('personal')}
          count={personalCount}
          color="bg-purple-900"
        >
          Personal
        </CategoryButton>
        <CategoryButton 
          active={activeCategory === 'universidad'} 
          onClick={() => setActiveCategory('universidad')}
          count={universidadCount}
          color="bg-blue-900"
        >
          Universidad
        </CategoryButton>
      </div>
      
        <TodoForm 
          onAddTodo={handleAddTodo} 
          activeCategory={activeCategory}
          editingTodo={editingTodo}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
      
      {isLoading ? (
          <LoadingSpinner message="Cargando tareas..." />
      ) : (
          <>
        <TodoList 
              todos={currentTodos}
          onToggleTodo={handleToggleTodo}
          onRemoveTodo={handleRemoveTodo}
          onClearCompleted={handleClearCompleted}
              filter={activeFilter}
              onChangeFilter={setActiveFilter}
          category={activeCategory}
              onEditTodo={handleEditTodo}
            />
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTodos.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
      )}
    </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </QueryClientProvider>
  );
};

const CategoryButton = ({ active, onClick, children, count, color = "bg-black" }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full transition-all duration-300 transform ${
      active 
        ? `${color} text-white scale-105 shadow-lg` 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } flex items-center space-x-2`}
  >
    <span>{children}</span>
    <span className={`${active ? 'bg-white text-black' : 'bg-gray-400 text-white'} 
      text-xs rounded-full px-2 py-0.5 transition-all duration-300`}>
      {count}
    </span>
  </button>
);

export default TodoApp;
