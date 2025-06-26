import React, { useState } from "react";

export const NuevoTableroForm = ({ onCreate }: { onCreate: (nombre: string) => void }) => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onCreate(nombre.trim());
    setNombre("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del tablero"
      />
      <button type="submit">Crear Tablero</button>
    </form>
  );
};
