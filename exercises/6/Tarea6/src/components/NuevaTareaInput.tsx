import React, { useState } from "react";

// Componente que permite ingresar y agregar una nueva tarea
const NuevaTareaInput: React.FC<{ onAgregar: (title: string) => void }> = ({
  onAgregar,
}) => {
  // Estado para almacenar el texto del input
  const [texto, setTexto] = useState("");

  // Función que se llama al presionar el botón "Agregar" o Enter
  const agregar = () => {
    if (texto.trim()) {
      onAgregar(texto); // Llama a la función del padre para agregar la tarea
      setTexto(""); // Limpia el input
    }
  };

  // Maneja la tecla presionada en el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      agregar(); // Si es Enter, agrega la tarea
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)} // Actualiza el estado texto
        onKeyDown={handleKeyDown} // Detecta tecla Enter
        placeholder="Nueva tarea"
      />
      <button onClick={agregar}>Agregar</button>
    </div>
  );
};

export default NuevaTareaInput;
