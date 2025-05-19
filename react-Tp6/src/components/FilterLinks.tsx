import React from "react";

interface FilterLinksProps {
  currentFilter: string;
  onFilterChange?: (filter: string) => void;
}

const filters = [
  { key: "all", label: "Todas" },
  { key: "incomplete", label: "Pendientes" },
  { key: "completed", label: "Hechas" },
];

const FilterLinks: React.FC<FilterLinksProps> = ({ currentFilter, onFilterChange }) => {
  const handleClick = (filter: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      window.history.replaceState({}, "", `?filter=${filter}`);
      window.dispatchEvent(new CustomEvent("reminders-updated"));
    }
  };

  return (
    <div className="flex gap-3 justify-center mt-6" data-current-filter={currentFilter}>
      {filters.map(f => {
        const active = f.key === currentFilter;
        return (
          <a
            key={f.key}
            href={`?filter=${f.key}`}
            data-filter={f.key}
            className={
              "px-4 py-2 rounded-full " +
              (active
                ? "bg-rose-600 text-white"
                : "border border-rose-500 text-rose-500 hover:bg-rose-50")
            }
            onClick={e => handleClick(f.key, e)}
          >
            {f.label}
          </a>
        );
      })}
    </div>
  );
};

export default FilterLinks;