import React from 'react';

const TodoList = ({ todos, onToggleTodo, onRemoveTodo, onClearCompleted, filter, onChangeFilter, category, onEditTodo }) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border-t-4 border-t-black animate-fadeIn transition-all duration-500 hover:shadow-2xl">
      <div className="p-4 border-b bg-gray-50 bg-opacity-70">
        <div className="flex justify-between items-center mb-4">
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
          {todos.some(todo => todo.completed) && (
            <button 
              onClick={onClearCompleted}
              className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center gap-1 group opacity-80 hover:opacity-100"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar completadas
            </button>
          )}
        </div>
      </div>
      <div className="p-2">
        {filteredTodos.length === 0 ? (
          <div className="text-gray-500 text-center py-8 animate-pulse">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No hay tareas{filter !== 'all' ? " " + filter + "s" : ""}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => onToggleTodo(todo.id)}
                onRemove={() => onRemoveTodo(todo.id)}
                index={index}
                onEdit={() => onEditTodo(todo)}
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

const TodoItem = ({ todo, onToggle, onRemove, index, onEdit }) => (
  <li className="flex items-center justify-between py-3 px-2 group">
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${todo.completed ? 'border-green-500 bg-green-100' : 'border-purple-500 bg-white'}`}
        aria-label="Completar tarea"
      >
        {todo.completed && (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.text}</span>
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${todo.category === 'personal' ? 'bg-purple-200 text-purple-900' : 'bg-blue-200 text-blue-900'}`}>{todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}</span>
    </div>
    <div className="flex gap-2 items-center">
      <button
        onClick={onEdit}
        className="text-gray-400 hover:text-blue-500 transition-colors duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Editar tarea"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9.293-9.293a1 1 0 00-1.414-1.414L9 11z" />
        </svg>
      </button>
      <button 
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Eliminar tarea"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </li>
);

export default TodoList;
