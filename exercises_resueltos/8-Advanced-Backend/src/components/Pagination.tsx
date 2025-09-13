import React from 'react';
import { useUIStore } from "../store/useUIStore";
// TASKS_PER_PAGE is not directly used here anymore as totalPages is provided

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number; // Could be used to display "Showing X-Y of Z items"
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalItems }) => {
  const setPage = useUIStore((s) => s.setPage);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  // Optional: Display item count
  // const startItem = (currentPage - 1) * TASKS_PER_PAGE + 1;
  // const endItem = Math.min(currentPage * TASKS_PER_PAGE, totalItems);


  return (
    <div className="flex flex-col items-center mt-6 space-y-2">
        {/* Optional: Item count display */}
        {/* <p className="text-sm text-gray-600">
            Showing {startItem}-{endItem} of {totalItems} tasks
        </p> */}
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
            >
                Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
            >
                Next
            </button>
        </div>
    </div>
  );
};