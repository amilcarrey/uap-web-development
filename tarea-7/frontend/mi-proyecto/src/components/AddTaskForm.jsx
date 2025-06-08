import React, { useState, useEffect } from 'react'; // ¡Importa useEffect!

// Acepta nuevas props: initialTaskText, isEditing, onCancelEdit
const AddTaskForm = ({ onAddTask, initialTaskText = '', isEditing = false, onCancelEdit }) => {
  const [taskText, setTaskText] = useState(initialTaskText);

  
  useEffect(() => {
    setTaskText(initialTaskText);
  }, [initialTaskText]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      
      if (!isEditing) {
        setTaskText('');
      }
    }
  };

  return (
    <section className="mb-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 justify-center w-3/5 mx-auto">
        <input
          type="text"
          name="task"
          // Cambia el placeholder según si estamos editando o añadiendo
          placeholder={isEditing ? "Edit your task..." : "What do you need to do?"}
          className="flex-1 p-2 border border-gray-300 rounded-md text-base"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          type="submit"
          className="w-[50px] h-[50px] flex items-center justify-center bg-blue-500 text-white text-[22px] font-bold rounded-full hover:bg-cyan-400 cursor-pointer leading-none align-middle -translate-y-[0px]"
        >
          {/* Cambia el texto del botón: ✓ para guardar (edición), + para añadir */}
          {isEditing ? '✓' : '+'}
        </button>
        {/* Botón de Cancelar para la edición */}
        {isEditing && (
          <button
            type="button" // ¡Importante! 'type="button"' para que no envíe el formulario
            onClick={onCancelEdit} // Llama a la función para cancelar la edición
            className="w-[50px] h-[50px] flex items-center justify-center bg-red-500 text-white text-[22px] font-bold rounded-full hover:bg-red-400 cursor-pointer leading-none align-middle -translate-y-[0px]"
          >
            ✕ {/* Un icono de cerrar o una 'X' */}
          </button>
        )}
      </form>
    </section>
  );
};

export default AddTaskForm;