import { useState } from 'react';

type Props = {
  onAddTask: (text: string) => void;
};

function TaskInput({ onAddTask }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="add-task-form"
      className="BarTask flex justify-center mt-[20px] space-x-[20px] w-full"
    >
      <input
        type="text"
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="addTask w-[60%] h-[40px] rounded-[5px] border border-black px-[10px] placeholder-gray-500 italic"
        placeholder="Add a task..."
        required
      />
      <button
        type="submit"
        className="addTaskButton w-[15%] rounded-[5px] border border-black bg-[rgb(83,57,88)] text-white font-bold cursor-pointer hover:bg-[rgb(124,1,118)]"
      >
        ADD
      </button>
    </form>
  );
}

export default TaskInput;
