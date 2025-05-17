import React from 'react';

const TodoList = ({ todos, onToggleTodo, onRemoveTodo, filter, onChangeFilter, category, onClearCompleted }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'personal': return 'border-purple-900';
      case 'universidad': return 'border-blue-900';
      default: return 'border-gray-300';
    }
  };
  
  const getCategoryBg = (cat) => {
    switch (cat) {
      case 'personal': return 'bg-purple-900';
      case 'universidad': return 'bg-blue-900';
      default: return 'bg-gray-900';
    }
  };

  // Verificar si hay tareas completadas
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className={`bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border-t-4 ${
      category === 'personal' ? 'border-t-purple-900' : 
      category === 'universidad' ? 'border-t-blue-900' : 
      'border-t-black'
    } animate-fadeIn transition-all duration-500 hover:shadow-2xl`}>
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 bg-opacity-70">
        <div className="flex gap-2">
          <FilterButton 
            label="Todas" 
            isActive={filter === 'all'} 
            onClick={() => onChangeFilter('all')} 
          />
          <FilterButton 
            label="Pendientes" 
            isActive={filter === 'active'} 
            onClick={() => onChangeFilter('active')} 
          />
          <FilterButton 
            label="Completadas" 
            isActive={filter === 'completed'} 
            onClick={() => onChangeFilter('completed')} 
          />
        </div>
        
        {/* Botón para eliminar tareas completadas */}
        {hasCompletedTodos && (
          <button 
            onClick={onClearCompleted}
            className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300
              flex items-center gap-1 group opacity-80 hover:opacity-100"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Eliminar completadas
          </button>
        )}
      </div>

      <div className="p-2">
        {todos.length === 0 ? (
          <div className="text-gray-500 text-center py-8 animate-pulse">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p>No hay tareas{filter !== 'all' ? " " + filter + "s" : ""}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onRemove={onRemoveTodo}
                categoryColor={getCategoryColor(todo.category)}
                categoryBg={getCategoryBg(todo.category)}
                index={index}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
      isActive 
        ? 'bg-black text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const TodoItem = ({ todo, onToggle, onRemove, categoryColor, categoryBg, index }) => (
  <li className={`animate-fadeIn py-3 px-4 flex items-center justify-between group
      border-l-4 ${categoryColor} hover:bg-gray-50 transition-all duration-300`}
      style={{animationDelay: `${index * 50}ms`}}
  >
    <div className="flex items-center gap-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={`w-5 h-5 appearance-none rounded-full border-2 ${categoryColor} 
            cursor-pointer transition-all duration-300 checked:bg-current`}
        />
        {todo.completed && (
          <svg className="w-3 h-3 text-white absolute left-1 top-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`${todo.completed ? "line-through text-gray-400" : "text-gray-800"} 
          transition-all duration-300`}>
          {todo.text}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${categoryBg} text-white opacity-70
          transition-all duration-300 group-hover:opacity-100`}>
          {todo.category === 'personal' ? 'Personal' : 'Universidad'}
        </span>
      </div>
    </div>
    <button 
      onClick={() => onRemove(todo.id)}
      className="text-gray-400 hover:text-red-500 transition-colors duration-300
        opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label="Eliminar tarea"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </button>
  </li>
);

export default TodoList;
