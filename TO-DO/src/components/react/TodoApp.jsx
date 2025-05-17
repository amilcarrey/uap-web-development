import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { fetchTodos, addTodo as addTodoService, updateTodo, deleteTodo } from '../../services/todoService';
import { todos as todosStore, addTodo as addTodoStore, toggleTodo, removeTodo, removeCompletedTodos } from '../../store/todoStore';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);
  const [useLocalOnly, setUseLocalOnly] = useState(false);

  // Cargar tareas iniciales
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        
        if (!useLocalOnly) {
          try {
            const data = await fetchTodos();
            setTodos(data);
            setError(null);
            return;
          } catch (err) {
            console.error('Error al cargar tareas del API, usando localStorage:', err);
            setError('Error al cargar tareas del servidor. Usando datos locales.');
            setUseLocalOnly(true);
          }
        }
        
        // Si llegamos aquí, usaremos los datos locales
        const storeData = todosStore.get();
        setTodos(storeData);
        
      } catch (err) {
        setError('Error al cargar tareas. Por favor recarga la página.');
        console.error('Error crítico fetching todos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [useLocalOnly]);

  // Función para manejar el cierre del mensaje de error
  const dismissError = () => setError(null);

  // Añadir una nueva tarea
  const addTodo = async (text, category = 'personal') => {
    if (!text || !text.trim()) {
      setError('El texto de la tarea no puede estar vacío');
      return;
    }

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const newTodo = {
        id: tempId,
        text: text.trim(),
        category,
        completed: false
      };
      
      setTodos(prev => [...prev, newTodo]);
      
      if (!useLocalOnly) {
        try {
          // API call
          const savedTodo = await addTodoService(text, category);
          
          // Update with real data from server
          setTodos(prev => prev.map(todo => 
            todo.id === tempId ? savedTodo : todo
          ));
          
          return;
        } catch (err) {
          console.error('Error al añadir tarea en API:', err);
          setError('No se pudo guardar en el servidor. Datos guardados localmente.');
          setUseLocalOnly(true);
        }
      }
      
      // Fallback a store local
      const storeTodo = addTodoStore(text, category);
      setTodos(prev => prev.map(todo => 
        todo.id === tempId ? storeTodo : todo
      ));
      
    } catch (err) {
      setError('Error al añadir tarea');
      console.error('Error adding todo:', err);
    }
  };

  // Cambiar el estado de una tarea
  const toggleTodoItem = async (id) => {
    try {
      // Encontrar la tarea y su estado actual
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;
      
      // Optimistic update
      const newCompleted = !todoToUpdate.completed;
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: newCompleted } : todo
        )
      );
      
      if (!useLocalOnly) {
        try {
          // API call
          await updateTodo(id, { completed: newCompleted });
          return;
        } catch (err) {
          console.error('Error al actualizar tarea en API:', err);
          setError('No se pudo actualizar en el servidor. Cambios guardados localmente.');
          setUseLocalOnly(true);
        }
      }
      
      // Fallback a store local
      toggleTodo(id);
      
    } catch (err) {
      setError('Error al actualizar tarea');
      console.error('Error toggling todo:', err);
      
      // Revertir optimistic update
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  // Eliminar una tarea
  const removeTodoItem = async (id) => {
    try {
      // Guardar tarea para posible revert
      const todoToRemove = todos.find(todo => todo.id === id);
      
      // Optimistic update
      setTodos(prev => prev.filter(todo => todo.id !== id));
      
      if (!useLocalOnly) {
        try {
          // API call
          await deleteTodo(id);
          return;
        } catch (err) {
          console.error('Error al eliminar tarea en API:', err);
          setError('No se pudo eliminar en el servidor. Cambios guardados localmente.');
          setUseLocalOnly(true);
        }
      }
      
      // Fallback a store local
      removeTodo(id);
      
    } catch (err) {
      setError('Error al eliminar tarea');
      console.error('Error removing todo:', err);
      
      // Revertir optimistic update si tenemos la tarea
      const todoToRestore = todos.find(todo => todo.id === id);
      if (todoToRestore) {
        setTodos(prev => [...prev, todoToRestore]);
      }
    }
  };

  // Eliminar todas las tareas completadas
  const clearCompletedTodos = async () => {
    try {
      // Encontrar las tareas completadas para eliminar
      const completedTodos = todos.filter(todo => todo.completed);
      
      if (completedTodos.length === 0) return;
      
      // Optimistic update - eliminar todas las tareas completadas de la UI
      setTodos(prev => prev.filter(todo => !todo.completed));
      
      if (!useLocalOnly) {
        try {
          // Para cada tarea completada, llamar al endpoint DELETE
          const deletePromises = completedTodos.map(todo => 
            deleteTodo(todo.id)
          );
          
          // Esperar a que todas las eliminaciones se completen
          await Promise.all(deletePromises);
          return;
        } catch (err) {
          console.error('Error al eliminar tareas completadas en API:', err);
          setError('No se pudieron eliminar las tareas en el servidor. Cambios guardados localmente.');
          setUseLocalOnly(true);
        }
      }
      
      // Fallback a store local
      removeCompletedTodos();
      
    } catch (err) {
      setError('Error al eliminar tareas completadas');
      console.error('Error clearing completed todos:', err);
      
      // Si hay error, recargar todas las tareas para asegurarnos que la UI esté sincronizada
      const storeData = todosStore.get();
      setTodos(storeData);
    }
  };

  // Filtrar por estado y categoría
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

  // Contar tareas por categoría
  const personalCount = todos.filter(todo => todo.category === 'personal').length;
  const universidadCount = todos.filter(todo => todo.category === 'universidad').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="p-3 bg-red-100 bg-opacity-80 text-red-700 rounded-lg animate-shake flex justify-between items-center backdrop-blur-sm shadow-lg">
          <span>{error}</span>
          <button 
            className="ml-2 text-sm font-bold"
            onClick={dismissError}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}
      
      {useLocalOnly && (
        <div className="p-3 bg-yellow-100 bg-opacity-80 text-yellow-800 rounded-lg backdrop-blur-sm shadow-lg">
          <p>Modo sin conexión: Los cambios se guardan localmente.</p>
          <button 
            onClick={() => setUseLocalOnly(false)}
            className="text-sm underline mt-1 hover:text-yellow-900"
          >
            Intentar conectar al servidor
          </button>
        </div>
      )}
      
      {/* Selector de categoría con efecto de animación */}
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
      
      <TodoForm onAddTodo={addTodo} activeCategory={activeCategory} />
      
      {isLoading ? (
        <div className="text-center p-10">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-black border-r-transparent"></div>
          <p className="mt-4">Cargando tareas...</p>
        </div>
      ) : (
        <TodoList 
          todos={filteredTodos}
          onToggleTodo={toggleTodoItem}
          onRemoveTodo={removeTodoItem}
          onClearCompleted={clearCompletedTodos}
          filter={filter}
          onChangeFilter={setFilter}
          category={activeCategory}
        />
      )}
    </div>
  );
};

// Componente para los botones de categoría
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
