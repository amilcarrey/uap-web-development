import type { TaskFilter } from "../types";

type TaskFiltersProps = {
  onFilter: (filter: TaskFilter) => void;
};

export default function TaskFilters({ onFilter }: TaskFiltersProps) {
  return (
    <div className="flex w-full justify-around text-center text-lg p-5">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onFilter("all");
        }}
        className="border-b-2 border-b-blue-500 w-44 p-2.5 rounded-tl-md rounded-tr-md hover:bg-blue-700"
      >
        All
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onFilter("incompleted");
        }}
        className="border-b-2 border-b-blue-500 w-52 p-2.5 rounded-tl-md rounded-tr-md hover:bg-blue-700"
      >
        Incompleted
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onFilter("completed");
        }}
        className="border-b-2 border-b-blue-500 w-52 p-2.5 rounded-tl-md rounded-tr-md hover:bg-blue-700"
      >
        Completed
      </a>
    </div>
  );
}
