import { motion } from 'framer-motion';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function TaskList({ tasks = [], onToggle, onDelete }) { // Valor por defecto para tasks
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Debug visual
  console.log('Tareas recibidas en TaskList:', tasks);

  if (!tasks || tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center text-gray-500"
      >
        No hay tareas para mostrar
      </motion.div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {tasks.map(task => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md"
          >
            <label className="flex items-center flex-grow cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => onToggle(task.id)}
                className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className={`flex-grow ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text || 'Tarea sin texto'} {/* Fallback por si acaso */}
              </span>
            </label>
            
            <button
              onClick={() => setTaskToDelete(task.id)}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              ×
            </button>
          </motion.li>
        ))}
      </ul>

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onConfirm={() => {
          onDelete(taskToDelete);
          setTaskToDelete(null);
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}