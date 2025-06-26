import React from "react";
import { useSettings } from "../context/SettingsContext";

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
  const { settings } = useSettings();
  const isDarkTheme = settings?.theme === "dark";

  // Función para mostrar texto amigable para cada filtro
  const getButtonLabel = (option: FilterOption) => {
    switch (option) {
      case "all":
        return "Todas";
      case "done":
        return "Completas";
      case "undone":
        return "Incompletas";
      default:
        return option;
    }
  };

  return (
    <>
      {( ["all", "done", "undone"] as FilterOption[] ).map((option) => (
        <button
          key={option}
          onClick={() => {
            setCurrentFilter(option);
            setCurrentPage(1); // resetear paginación al cambiar filtro
          }}
          disabled={currentFilter === option}
          className={`text-lg rounded px-6 py-3 border-2 ${
            currentFilter === option
              ? isDarkTheme
                ? "bg-gray-500 text-white border-gray-500 cursor-default"
                : "bg-orange-200 text-black border-orange-200 cursor-default"
              : isDarkTheme
              ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-600 transition"
              : "bg-orange-100 text-black border-orange-100 hover:bg-orange-200 transition"
          }`}
        >
          {getButtonLabel(option)}
        </button>
      ))}
    </>
  );
};
