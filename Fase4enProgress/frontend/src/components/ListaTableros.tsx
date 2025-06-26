import React from "react";
import CompartirTablero from "./CompartirTablero";

interface Board {
  id: string;
  title: string;
}

interface Props {
  boards: Board[];
}

const ListaTableros: React.FC<Props> = ({ boards }) => {
  return (
    <div>
      {boards.map((board) => (
        <div key={board.id} className="mb-4 p-2 border rounded">
          <h2 className="font-bold">{board.title}</h2>
          {/* Aquí llamamos al componente de compartir, pasando el boardId */}
          <CompartirTablero boardId={board.id} />
        </div>
      ))}
    </div>
  );
};

export default ListaTableros;
