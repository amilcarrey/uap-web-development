import React, { useState } from "react";
import toast from "react-hot-toast";

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
  const [tempTasksPerPage, setTempTasksPerPage] = useState(tasksPerPage.toString());

  const handleTasksPerPageChange = () => {
    const num = parseInt(tempTasksPerPage, 10);
    if (isNaN(num) || num < 1 || num > 1000) {
      toast.error("Por favor ingresa un número válido entre 1 y 1000.");
      setTempTasksPerPage(tasksPerPage.toString());
      return;
    }
    onTasksPerPageChange(num);
  };

  return (
  <section className="mx-6 mb-6">
    {/* Fila 1: Botones y texto */}
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage <= 1}
        className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50 dark:text-black dark:bg-gray-200"
      >
        ← Anterior
      </button>

      <div className="dark:text-black">
        Página {currentPage} de {totalPages}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50 dark:text-black dark:bg-gray-200"
      >
        Siguiente →
      </button>
    </div>

    {/* Fila 2: Tareas por página */}
    <section className="flex items-center justify-center gap-2">
      <label htmlFor="tasksPerPage" className="font-semibold dark:text-black">
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
        className="w-20 p-2 border rounded text-black"
        aria-label="Número de tareas por página"
      />
      <button
        onClick={handleTasksPerPageChange}
        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow"
      >
        OK
      </button>
    </section>
  </section>
);

};

export default Pagination;
