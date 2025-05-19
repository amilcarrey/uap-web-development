import React, { useCallback } from "react";

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
}

interface ReminderListProps {
  reminders: Reminder[];
  onRemindersUpdated?: () => void;
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders, onRemindersUpdated }) => {
  // Actualiza la lista después de una acción
  const handleRemindersUpdated = useCallback(() => {
    if (onRemindersUpdated) {
      onRemindersUpdated();
    } else {
      window.dispatchEvent(new CustomEvent("reminders-updated"));
    }
  }, [onRemindersUpdated]);

  // Completar o descompletar un recordatorio
  const handleToggle = async (id: string, completed: boolean) => {
    await fetch("http://localhost:4321/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });
    handleRemindersUpdated();
  };

  // Eliminar un recordatorio
  const handleDelete = async (id: string) => {
    await fetch("http://localhost:4321/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    handleRemindersUpdated();
  };

  return (
    <ul className="space-y-3 mb-8">
      {reminders.map((item) => (
        <li
          key={item.id}
          className={`flex items-center justify-between p-4 rounded-lg hover:bg-rose-100 transition-colors ${
            item.completed ? "bg-rose-50" : ""
          }`}
        >
          <button
            className="flex-grow flex items-center gap-3 w-full text-left toggle-reminder"
            onClick={() => handleToggle(item.id, !item.completed)}
            aria-label={item.completed ? "Marcar como pendiente" : "Marcar como completado"}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                item.completed ? "bg-rose-600 border-rose-600 text-white" : "border-gray-300"
              }`}
            >
              {item.completed ? "✓" : ""}
            </span>
            <span
              className={`text-lg ${
                item.completed ? "line-through text-gray-500" : "text-gray-700"
              }`}
            >
              {item.text}
            </span>
          </button>
          <button
            className="delete-reminder ml-4 text-rose-600 hover:text-rose-800 text-2xl font-light px-2"
            aria-label="Eliminar"
            onClick={() => handleDelete(item.id)}
            style={{ background: "none", border: "none" }}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ReminderList;