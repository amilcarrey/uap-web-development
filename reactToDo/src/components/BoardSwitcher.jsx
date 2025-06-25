import { useBoards } from '../hooks/useBoards';

export default function BoardSwitcher({ activeBoard, setActiveBoard }) {
  const { data: boards = [], isLoading } = useBoards();

  if (isLoading) return <div>Cargando boards...</div>;

  return (
    <div className="flex gap-2 mb-4">
      {boards.map(board => (
        <button
          key={board.id}
          className={`px-3 py-1 rounded ${activeBoard === board.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveBoard(board.id)}
        >
          {board.name}
        </button>
      ))}
    </div>
  );
}