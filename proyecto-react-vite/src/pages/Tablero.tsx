import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";

export default function Tablero() {
  const { id } = useParams();

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Tablero: {id}</h1>
      <TaskList boardId={id!} />
    </div>
  );
}
