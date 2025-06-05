import React, { useState } from 'react';
import { useAgregarTarea } from '../hooks/useTareas';
import { useAppStore } from '../store/appStore';

interface Props {
  onTareaAgregada?: () => void;
}

const NuevaTareaInput: React.FC<Props> = ({ onTareaAgregada }) => {
  const [content, setContent] = useState('');
  const agregarTarea = useAgregarTarea();
  const { showToast } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('La tarea no puede estar vacía', 'error');
      return;
    }
    agregarTarea.mutate(content, {
      onSuccess: () => {
        setContent('');
        if (onTareaAgregada) onTareaAgregada();
      },
      onError: () => {
        showToast('Error al agregar tarea', 'error');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="new-task-input">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Añadir nueva tarea..."
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default NuevaTareaInput;