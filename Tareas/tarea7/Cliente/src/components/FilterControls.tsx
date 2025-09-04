import { CustomButton } from './UiButton';

export interface Props {
  tabId: string;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
}

export function FilterControls({
  currentFilter,
  onFilterChange,
  onClearCompleted
}: Props) {

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-buttons-container flex gap-[10px] justify-center my-4 mx-0">
      {filters.map(filter => (
        <CustomButton
          key={filter.id}
          type="button"
          isActive={filter.id === currentFilter}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </CustomButton>
      ))}

      <CustomButton onClick={() => {
        onClearCompleted();
      }}>
        Limpiar completadas
      </CustomButton>
    </div>
  );
}
