import React from "react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const TaskForm: React.FC<Props> = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex w-full">
    <input
      type="text"
      placeholder="Qué necesitas hacer?"
      value={value}
      onChange={onChange}
      required
      className="flex-grow p-3 ml-2 border border-gray-300 rounded-md"
    />
    <button
      type="submit"
      className="bg-[#a8c99e] text-white px-6 py-3 rounded-md hover:bg-[#88c874]"
    >
      AGREGAR
    </button>
  </form>
);

export default TaskForm;
