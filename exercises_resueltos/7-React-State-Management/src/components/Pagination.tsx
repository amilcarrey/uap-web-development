import { useUIStore } from "../store/useUIStore";
import { TASKS_PER_PAGE } from "../hooks/tasks/useTasks";

interface Props {
  total: number;
}

export const Pagination: React.FC<Props> = ({ total }) => {
  const page = useUIStore((s) => s.page);
  const setPage = useUIStore((s) => s.setPage);

  const totalPages = Math.ceil(total / TASKS_PER_PAGE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>
      <span className="px-3 py-1">{page}</span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};