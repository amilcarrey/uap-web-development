import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- Importa esto
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../../services/todoService';

const queryClient = new QueryClient();

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar tareas. Por favor recarga la página.');
      console.error('Error cargando tareas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (text, category = 'personal') => {
    if (!text || !text.trim()) {
      setError('El texto de la tarea no puede estar vacío');
      return;
    }

    try {
      const newTodo = await addTodo(text.trim(), category);
      setTodos(prev => [...prev, newTodo]);
      setError(null);
    } catch (err) {
      setError('Error al añadir tarea');
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
    } catch (err) {
      setError('Error al actualizar tarea');
      console.error('Error actualizando tarea:', err);
    }
  };

  const handleRemoveTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Error al eliminar tarea');
      console.error('Error eliminando tarea:', err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      if (completedTodos.length === 0) return;

      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id))
      );
      
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setError('Error al eliminar tareas completadas');
      console.error('Error eliminando tareas completadas:', err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const categoryMatch = 
      activeCategory === 'all' || 
      todo.category === activeCategory;
    
    const statusMatch = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    return categoryMatch && statusMatch;
  });

  const personalCount = todos.filter(todo => todo.category === 'personal').length;
  const universidadCount = todos.filter(todo => todo.category === 'universidad').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="p-3 bg-red-100 bg-opacity-80 text-red-700 rounded-lg animate-shake flex justify-between items-center backdrop-blur-sm shadow-lg">
          <span>{error}</span>
          <button 
            className="ml-2 text-sm font-bold"
            onClick={() => setError(null)}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
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
      
      <TodoForm onAddTodo={handleAddTodo} activeCategory={activeCategory} />
      
      {isLoading ? (
        <div className="text-center p-10">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-black border-r-transparent"></div>
          <p className="mt-4">Cargando tareas...</p>
        </div>
      ) : (
        <TodoList 
          todos={filteredTodos}
          onToggleTodo={handleToggleTodo}
          onRemoveTodo={handleRemoveTodo}
          onClearCompleted={handleClearCompleted}
          filter={filter}
          onChangeFilter={setFilter}
          category={activeCategory}
        />
      )}
    </div>
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

return (
  <QueryClientProvider client={queryClient}>
    <TodoApp />
  </QueryClientProvider>
);

export default TodoApp;
