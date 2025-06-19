import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TasksResponse } from "../hooks/useTasks";
import GorgeousButton from "./GorgeousButton";

interface PaginationProps {
  pagination: TasksResponse["pagination"];
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,
    totalItems,
  } = pagination;

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-amber-950 border-t border-amber-200/20 gap-4">
      <div className="text-amber-100 text-sm">
        Showing {startItem}-{endItem} of {totalItems} tasks
      </div>

      <div className="flex items-center gap-2">
        <GorgeousButton
          className="flex items-center gap-1 py-1 rounded "
          onClick={handlePrevious}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </GorgeousButton>

        <span className="text-amber-100 px-4">
          Page {currentPage} of {totalPages}
        </span>

        <GorgeousButton
          onClick={handleNext}
          disabled={!hasNextPage}
          className={`flex items-center gap-1 px-3 py-1 rounded ${
            hasNextPage
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </GorgeousButton>
      </div>
    </div>
  );
};

export default Pagination;
