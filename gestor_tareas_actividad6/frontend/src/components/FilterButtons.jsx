const FilterButtons = ({ currentFilter, onChange }) => {
  return (
    <div className="filtros">
      <button
        className={`btn-filter ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        Todas
      </button>
      <button
        className={`btn-filter ${currentFilter === 'active' ? 'active' : ''}`}
        onClick={() => onChange('active')}
      >
        Activas
      </button>
      <button
        className={`btn-filter ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onChange('completed')}
      >
        Completadas
      </button>
    </div>
  );
};

export default FilterButtons;