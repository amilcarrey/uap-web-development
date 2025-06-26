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
    const trimmed = editingContent.trim();
    if (trimmed.length === 0) return;
    onSave(trimmed);
    setEditingContent(""); 
  };

  return (
    <form onSubmit={handleSubmit} className="buscador">
      <input
        type="text"
        value={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        placeholder={isEditing ? "Editar tarea..." : "Nueva tarea"}
        minLength={1}
        maxLength={50}
      />
      <button type="submit" className="boton-add">
        {isEditing ? "Guardar" : "ADD"}
      </button>
      {isEditing && (
        <button type="button" onClick={onCancel} className="boton-add">
          Cancelar
        </button>
      )}
    </form>
  );
};
