import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import ToastContainer from './ToastContainer';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../../services/todoService';
import useUIStore from '../../hooks/useUIStore';
import useToast from '../../hooks/useToast';

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

  const [todos, setTodos] = React.useState([]);
  const [editingTodo, setEditingTodo] = React.useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      clearError();
      showSuccess('Tareas cargadas correctamente');
    } catch (err) {
      setError('Error al cargar tareas. Por favor recarga la página.');
      showError('Error al cargar las tareas');
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text, category = 'personal') => {
    if (!text || !text.trim()) {
      showError('El texto de la tarea no puede estar vacío');
      return;
    }

    try {
      const newTodo = await addTodo(text.trim(), category);
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
