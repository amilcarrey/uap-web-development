import React, { useState, useEffect } from 'react';

const TodoForm = ({ onAddTodo, activeCategory, editingTodo, onSaveEdit, onCancelEdit }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('personal');
  
  // Si estamos editando, inicializar los valores
  useEffect(() => {
    if (editingTodo) {
      setText(editingTodo.text);
      setCategory(editingTodo.category);
    } else {
      setText('');
      setCategory(activeCategory !== 'all' ? activeCategory : 'personal');
    }
  }, [editingTodo, activeCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      if (editingTodo) {
        onSaveEdit(text.trim(), category);
      } else {
        onAddTodo(text.trim(), category);
      }
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 animate-slideUp">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={editingTodo ? "Editar tarea..." : "Agregar nueva tarea..."}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-purple-500 transition-all duration-300 bg-white 
            bg-opacity-90 backdrop-blur-md shadow-md"
          autoFocus
        />
        
        {activeCategory === 'all' && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-blue-900 bg-white bg-opacity-90 backdrop-blur-md
              shadow-md transition-all duration-300"
          >
            <option value="personal">Personal</option>
            <option value="universidad">Universidad</option>
          </select>
        )}
        
        <button
          type="submit"
          className={`px-6 py-2 ${editingTodo ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white rounded-lg \
            transition-all duration-300 transform hover:scale-105 focus:outline-none \
            focus:ring-2 focus:ring-gray-500 shadow-md`}
        >
          <div className="flex items-center justify-center">
            <span>{editingTodo ? 'Guardar' : 'Agregar'}</span>
            {editingTodo ? (
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            )}
          </div>
        </button>
        {editingTodo && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
