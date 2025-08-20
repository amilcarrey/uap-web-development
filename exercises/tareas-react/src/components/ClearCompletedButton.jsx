// src/components/ClearCompletedButton.jsx

export default function ClearCompletedButton({ onClear }) {
  return (
    <div className="mt-4">
      <button
        onClick={onClear}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear Completed
      </button>
    </div>
  );
}
