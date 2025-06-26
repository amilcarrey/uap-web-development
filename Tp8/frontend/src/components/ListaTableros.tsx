// src/components/ListaTableros.tsx
import { Link } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';

const ListaTableros = () => {
  const { data: boards, isLoading, isError } = useBoards();

  if (isLoading) return <p className="text-gray-500">Cargando tableros...</p>;
  if (isError) return <p className="text-red-500">Error al cargar tableros</p>;
  if (!boards || boards.length === 0) return <p>No tenés tableros todavía.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          to={`/tablero/${board.id}`}
          className="border p-4 rounded-lg hover:bg-gray-100 transition"
        >
          <h2 className="font-bold text-lg">{board.title}</h2>
          <p className="text-sm text-gray-500">ID: {board.id}</p>
        </Link>
      ))}
    </div>
  );
};

export default ListaTableros;
