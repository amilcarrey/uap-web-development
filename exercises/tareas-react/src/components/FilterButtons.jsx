// src/components/FilterButtons.jsx

export default function FilterButtons({ filter, onChangeFilter }) {
  return (
    <div className="mb-4">
      <button
        onClick={() => onChangeFilter('all')}
        disabled={filter === 'all'}
        className={`mr-2 px-3 py-1 rounded ${
          filter === 'all' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => onChangeFilter('active')}
        disabled={filter === 'active'}
        className={`mr-2 px-3 py-1 rounded ${
          filter === 'active' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Activas
      </button>
      <button
        onClick={() => onChangeFilter('completed')}
        disabled={filter === 'completed'}
        className={`px-3 py-1 rounded ${
          filter === 'completed' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        Completadas
      </button>
    </div>
  );
}
