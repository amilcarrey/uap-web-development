import React from "react";

interface ClearCompletedFormProps {
  reminders: Array<{ completed: boolean }>;
  onRemindersUpdated?: () => void;
}

const ClearCompletedForm: React.FC<ClearCompletedFormProps> = ({
  reminders,
  onRemindersUpdated,
}) => {
  const hasCompleted = reminders.some((r) => r.completed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4321/api/clear", {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    if (onRemindersUpdated) {
      onRemindersUpdated();
    } else {
      window.dispatchEvent(new CustomEvent("reminders-updated"));
    }
  };

  if (!hasCompleted) return null;

  return (
    <form
      id="clear-complete-form"
      className="mb-8"
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="w-full py-2 bg-gray-100 text-rose-600 rounded-lg hover:bg-gray-200 font-medium"
      >
        Limpiar completados
      </button>
    </form>
  );
};

export default ClearCompletedForm;