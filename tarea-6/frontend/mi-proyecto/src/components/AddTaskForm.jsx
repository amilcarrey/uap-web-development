import React, { useState } from 'react';

const AddTaskForm = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <section className="mb-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 justify-center w-3/5 mx-auto">
        <input
          type="text"
          name="task"
          placeholder="What do you need to do?"
          className="flex-1 p-2 border border-gray-300 rounded-md text-base"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          type="submit"
          className="w-[50px] h-[50px] flex items-center justify-center bg-blue-500 text-white text-[22px] font-bold rounded-full hover:bg-cyan-400 cursor-pointer leading-none align-middle -translate-y-[0px]"
        >
          +
        </button>
      </form>
    </section>
  );
};

export default AddTaskForm;