import React from 'react';

interface ClearCompletedProps {
  onClear: () => void;
}

const ClearCompleted: React.FC<ClearCompletedProps> = ({ onClear }) => {
  return (
    <button
      onClick={onClear}
      className="mt-4 text-sm text-red-500 hover:text-red-700 underline"
    >
      Clear Completed
    </button>
  );
};

export default ClearCompleted;
