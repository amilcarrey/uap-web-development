import { motion } from 'framer-motion';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function TaskFilters({ 
  currentFilter, 
  onFilterChange, 
  onClearCompleted,
  activeCount = 0
}) {
  const [showClearModal, setShowClearModal] = useState(false);
  const filters = ['all', 'active', 'completed'];

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    onClearCompleted();
    setShowClearModal(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-6 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {activeCount} {activeCount === 1 ? 'item restante' : 'items restantes'}
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-full shadow-inner">
          {filters.map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => onFilterChange(filterType)}
              className={`px-4 py-1 rounded-full text-sm capitalize ${
                currentFilter === filterType 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: currentFilter === filterType ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {filterType}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleClearClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
        >
          Limpiar completadas
        </motion.button>
      </div>

      <ConfirmationModal
        isOpen={showClearModal}
        onConfirm={confirmClear}
        onCancel={() => setShowClearModal(false)}
        message="¿Estás seguro de que quieres eliminar todas las tareas completadas?"
      />
    </>
  );
}