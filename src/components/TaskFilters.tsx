import React from "react";

type Filter = "all" | "done" | "undone";

type Props = {
  currentFilter: Filter;
  onChange: (filter: Filter) => void;
};

const TaskFilters: React.FC<Props> = ({ currentFilter, onChange }) => (
  <div className="flex justify-around mt-4">
    <div className="flex space-x-6">
      {(["all", "done", "undone"] as Filter[]).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`bg-[#e8af9695] px-6 py-3 rounded-md text-lg hover:bg-[#d89e7c] ${
            currentFilter === f ? "border-b-4 border-[#e08123]" : ""
          }`}
        >
          {f === "all" ? "Todas" : f === "done" ? "Completas" : "Incompletas"}
        </button>
      ))}
    </div>
  </div>
);

export default TaskFilters;
