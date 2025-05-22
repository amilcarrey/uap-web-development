import React from "react";

const Filters: React.FC<{
  currentFilter: "all" | "completed" | "incomplete";
  onChange: (filter: "all" | "completed" | "incomplete") => void;
  onClearCompleted: () => void;
}> = ({ currentFilter, onChange, onClearCompleted }) => (
  <div className="flex justify-center mt-2 gap-2">
    {["all", "incomplete", "completed"].map((filter) => (
      <button
        key={filter}
        onClick={() => onChange(filter as any)}
        className={`px-4 py-2 rounded ${
          currentFilter === filter ? "bg-gray-400 font-bold" : "bg-gray-300"
        }`}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </button>
    ))}
    <button
      onClick={onClearCompleted}
      className="px-4 py-2 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
    >
      Clear Completed
    </button>
  </div>
);

export default Filters;
