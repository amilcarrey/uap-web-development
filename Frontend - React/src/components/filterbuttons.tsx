import React from "react";

export type FilterOption = "all" | "done" | "undone";

interface FilterButtonsProps {
  currentFilter: FilterOption;
  setCurrentFilter: (filter: FilterOption) => void;
  setCurrentPage: (page: number) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  setCurrentFilter,
  setCurrentPage,
}) => {
  return (
    <>
      {(["all", "done", "undone"] as FilterOption[]).map((option) => (
        <button
          key={option}
          onClick={() => {
            setCurrentFilter(option);
            setCurrentPage(1);
          }}
          disabled={currentFilter === option}
          className={`text-lg rounded px-6 py-3 border-2 ${
            currentFilter === option
              ? "bg-orange-200  border-orange-200 text-black cursor-default dark:bg-gray-500  dark:text-white  dark:border-gray-500"
              : "bg-orange-100 border-orange-100 text-black hover:bg-orange-200 transition dark:bg-gray-800 dark:hover:bg-gray-200 dark:text-white"
          }`}
        >
          {option === "all" ? "Todas" : option === "done" ? "Completas" : "Incompletas"}
        </button>
      ))}
    </>
  );
};
