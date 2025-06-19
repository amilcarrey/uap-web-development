import React, { useState } from "react";

const TaskForm: React.FC<{ onTaskAdded: (text: string) => void }> = ({ onTaskAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTaskAdded(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        placeholder="What do you need to do?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="flex-1 p-3 text-[18px] border border-gray-300 rounded-l-lg"
      />
      <button type="submit" className="bg-sky-400 text-white p-4 rounded-r-lg text-[18px]">
        ADD
      </button>
    </form>
  );
};

export default TaskForm;
