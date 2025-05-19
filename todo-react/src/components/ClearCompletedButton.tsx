import React from "react";

type ClearCompletedButtonProps = {
  onClearCompleted: () => void;
  hasCompleted: boolean;
};

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  onClearCompleted,
  hasCompleted,
}) => {
  if (!hasCompleted) return null;

  return (
    <button
      className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
      onClick={onClearCompleted}
      aria-label="Eliminar tareas completadas"
    >
      Eliminar completadas
    </button>
  );
};
