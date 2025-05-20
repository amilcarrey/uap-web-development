import { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      alert('¡Por favor ingresa una tarea válida!');
      return;
    }
    onAdd(taskText);
    setTaskText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="input-container">
        <label htmlFor="nombre" className="sr-only">Nombre</label>
        <input
          type="text"
          id="nombre"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          placeholder="Escribe tu tarea"
        />
        <button type="submit" aria-label="Confirmar nombre">OK</button>
      </div>
    </form>
  );
};

export default TaskForm;