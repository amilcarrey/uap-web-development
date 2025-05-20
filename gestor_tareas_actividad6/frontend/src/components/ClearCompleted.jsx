const ClearCompleted = ({ onClear }) => {
  return (
    <button
      className="btn-clear"
      onClick={onClear}
    >
      Clear Completed
    </button>
  );
};

export default ClearCompleted;