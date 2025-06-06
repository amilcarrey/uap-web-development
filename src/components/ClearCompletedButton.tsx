// logica de boton para borrar tareas completadas

import React from "react";

type Props = {
  onClear: () => void;
};

const ClearCompletedButton: React.FC<Props> = ({ onClear }) => (
  <div className="text-center mt-4">
    <button
      onClick={onClear}
      className="bg-[#e49d89dc] px-6 py-3 rounded-md text-lg hover:bg-[#cc7a5a]"
    >
      Limpiar
    </button>
  </div>
  
);

export default ClearCompletedButton;
