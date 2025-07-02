import React from 'react';

interface ClearCompletedProps {
  onClear: () => void;
}

const ClearCompleted: React.FC<ClearCompletedProps> = ({ onClear }) => {
  return (
    <button
      onClick={onClear}
      className="text-sm text-red-500 hover:text-red-700 underline"
    >
      Borrar completadas
    </button>
  );
};

export default ClearCompleted;
