import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function Index() {
  const [boards, setBoards] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4321/api/boards") 
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setBoards(data.boards);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Cargando tableros...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">wELCOME TO EL GESTOR DE RECORDATORIOS</h1>
      <div className="mb-4">
        {boards.length > 0 ? (
          <ul>
            {boards.map((board) => (
              <li key={board.id}>
                <Link to={`/boards/${board.id}`}>{board.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <span>No hay tableros disponibles</span>
        )}
      </div>
      <Link to="/boards/configuracion">CONFIGURACION</Link>
    </div>
  );
}