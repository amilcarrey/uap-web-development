type FilterFormProps = {
  search: string;
  setSearch: (value: string) => void;
  filter: "all" | "completed" | "incomplete";
  setFilter: (value: "all" | "completed" | "incomplete") => void;
};

export function FilterForm({ filter, setFilter }: FilterFormProps) {
  return (
    <form>
      <div className="filtros">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          type="button"
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completas
        </button>
        <button
          type="button"
          className={filter === "incomplete" ? "active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Incompletas
        </button>
      </div>
    </form>
  );
}
