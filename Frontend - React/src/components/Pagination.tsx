import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  tasksPerPage: number;
  onPageChange: (page: number) => void;
  onTasksPerPageChange: (tasksPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  tasksPerPage,
  onPageChange,
  onTasksPerPageChange,
}) => {
  const { settings } = useSettings();
  const theme = settings?.theme || "light";

  // Sincronizamos tempTasksPerPage con tasksPerPage prop
  const [tempTasksPerPage, setTempTasksPerPage] = useState(tasksPerPage.toString());

  useEffect(() => {
    setTempTasksPerPage(tasksPerPage.toString());
  }, [tasksPerPage]);

  // Valida y aplica el cambio de tareas por página
  const handleTasksPerPageChange = () => {
    const num = parseInt(tempTasksPerPage, 10);
    if (isNaN(num) || num < 1 || num > 1000) {
      toast.error("Por favor ingresa un número válido entre 1 y 1000.");
      setTempTasksPerPage(tasksPerPage.toString());
      return;
    }
    onTasksPerPageChange(num);
  };

  // Clases según tema para botones y texto
  const buttonClass =
    theme === "dark"
      ? "bg-gray-700 text-white disabled:opacity-50"
      : "bg-orange-300 text-black disabled:opacity-50";

  const textClass = theme === "dark" ? "text-white" : "text-black";

  const inputClass =
    theme === "dark"
      ? "w-20 p-2 border rounded text-white bg-gray-800 border-gray-600"
      : "w-20 p-2 border rounded text-black bg-white";

  return (
    <section className="mx-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
          className={`${buttonClass} px-4 py-2 rounded`}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <div className={textClass}>
          Página {currentPage} de {totalPages}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className={`${buttonClass} px-4 py-2 rounded`}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </div>

      <section className="flex items-center justify-center gap-2">
        <label htmlFor="tasksPerPage" className={`font-semibold ${textClass}`}>
          Tareas por página:
        </label>
        <input
          id="tasksPerPage"
          type="number"
          min={1}
          value={tempTasksPerPage}
          onChange={(e) => setTempTasksPerPage(e.target.value)}
          onBlur={handleTasksPerPageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleTasksPerPageChange();
            }
          }}
          className={inputClass}
          aria-label="Número de tareas por página"
        />
        <button
          onClick={handleTasksPerPageChange}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow"
          aria-label="Confirmar número de tareas por página"
        >
          OK
        </button>
      </section>
    </section>
  );
};

export default Pagination;
