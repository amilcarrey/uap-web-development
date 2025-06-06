import React from "react";
import { useTareas } from "../../hooks/useTareas";
import { useTareasStore } from "../../store/TareasStore";
import { NuevaTareaForm } from "./TareaNueva";
import { TareaItem } from "./TareaItem";

interface Props {
  tableroId: string;
}

export const ListaTareas = ({ tableroId }: Props) => {
  const { tareasQuery, addTarea, updateTarea, deleteTarea } = useTareas(tableroId, useTareasStore((s) => s.page));
  const { editing, startEditing, cancelEditing, setEditingContent, setPage } = useTareasStore();

  const tareas = tareasQuery.data || [];
  const isEditing = editing.id !== null;

  const handleSave = (content: string) => {
    if (isEditing) {
      updateTarea.mutate({ id: editing.id!, content, completed: false, tableroId });
      cancelEditing();
    } else {
      addTarea.mutate(content);
    }
  };

  return (
    <div className="to-do">
      <NuevaTareaForm
        onSave={handleSave}
        editingContent={editing.content}
        setEditingContent={setEditingContent}
        isEditing={isEditing}
        onCancel={cancelEditing}
      />
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tareas.map((t) => (
          <TareaItem
            key={t.id}
            tarea={t}
            onUpdate={updateTarea.mutate}
            onDelete={deleteTarea.mutate}
          />
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <button disabled={useTareasStore.getState().page === 1} onClick={() => setPage(useTareasStore.getState().page - 1)}>
          Anterior
        </button>
        <button onClick={() => setPage(useTareasStore.getState().page + 1)}>Siguiente</button>
      </div>
    </div>
  );
};
