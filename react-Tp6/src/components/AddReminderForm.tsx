import React, { useState } from "react";

interface AddReminderFormProps {
  onReminderAdded?: () => void;
}

const AddReminderForm: React.FC<AddReminderFormProps> = ({ onReminderAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Llama a la API para agregar el recordatorio
    await fetch("http://localhost:4321/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ text: trimmedText }),
    });

    setText(""); // Limpia el input

    // Notifica al componente principal para refrescar la lista
    if (onReminderAdded) {
      onReminderAdded();
    } else {
      window.dispatchEvent(new CustomEvent("reminders-updated"));
    }
  };

  return (
    <form
      id="add-reminder-form"
      onSubmit={handleSubmit}
      className="flex gap-2 mb-8"
    >
      <input
        id="add-reminder-input"
        name="text"
        type="text"
        placeholder="¿Qué necesitas recordar?"
        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-lg"
        required
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-lg font-medium"
      >
        Agregar
      </button>
    </form>
  );
};

export default AddReminderForm;