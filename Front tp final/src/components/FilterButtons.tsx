// src/components/FilterButtons.tsx

interface FilterButtonsProps {
  filters: Array<{ key: string; label: string }>;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onPageReset?: () => void;
}

export function FilterButtons({ 
  filters, 
  currentFilter, 
  onFilterChange, 
  onPageReset 
}: FilterButtonsProps) {
  const handleFilterChange = (filterKey: string) => {
    onFilterChange(filterKey);
    onPageReset?.(); // Resetear página cuando cambie el filtro
  };

  return (
    <footer className="p-4 flex justify-center gap-4 bg-pink-100 border-t border-pink-200">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => handleFilterChange(f.key)}
          className={
            "px-4 py-2 rounded-xl font-medium transition " +
            (currentFilter === f.key
              ? "bg-pink-400 text-white"
              : "bg-pink-300 hover:bg-pink-400 text-white")
          }
        >
          {f.label}
        </button>
      ))}
    </footer>
  );
}
