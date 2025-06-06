
import React from "react";

interface Props {
  onSave: (content: string) => void;
  editingContent: string;
  setEditingContent: (c: string) => void;
  isEditing: boolean;
  onCancel: () => void;
}

export const NuevaTareaForm: React.FC<Props> = ({
  onSave,
  editingContent,
  setEditingContent,
  isEditing,
  onCancel,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingContent);
    setEditingContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-tarea">
      <input
        type="text"
        value={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        placeholder={isEditing ? "Editar tarea..." : "Nueva tarea"}
      />
      <button type="submit">{isEditing ? "Guardar" : "Agregar"}</button>
      {isEditing && <button onClick={onCancel}>Cancelar</button>}
    </form>
  );
};
