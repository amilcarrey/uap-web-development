import React from 'react';
import { toast } from 'react-hot-toast';

interface ClearCompletedProps {
  onClear: () => void;
}

const ClearCompleted: React.FC<ClearCompletedProps> = ({ onClear }) => {
  const handleClick = () => {
    try {
      onClear();
    } catch {
      toast.error('Error al borrar completadas');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm text-red-500 hover:text-red-700 underline"
    >
      Borrar completadas
    </button>
  );
};

export default ClearCompleted;
