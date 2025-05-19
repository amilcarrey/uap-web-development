function ClearCompleted({ onClear }) {
    return (
      <button
        onClick={onClear}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Borrar Completadas
      </button>
    );
  }
  
  export default ClearCompleted;
  