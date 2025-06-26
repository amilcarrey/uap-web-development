import { useParams } from "react-router-dom";
import { ListaTareas } from "../../components/ListaTarea";

export default function TableroPage() {
  const { tableroId } = useParams<{ tableroId: string }>();

  if (!tableroId) return <div>No se especificó un tablero</div>;

  return (
    <div>
      <h2>Tareas del Tablero {tableroId}</h2>
      <ListaTareas tableroId={tableroId} />
    </div>
  );
}
