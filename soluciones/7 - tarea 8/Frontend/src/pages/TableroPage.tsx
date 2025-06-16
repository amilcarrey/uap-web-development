import { useParams } from "react-router-dom";
import { NuevoTareaForm } from "../components/NuevoTareaForm";
import { TareaList } from "../components/TareaList";
import { EditarTareaForm } from "../components/EditarTareaForm";
import { useUIStore } from "../store/uiStore";

export function TableroPage() {
  const { id } = useParams<{ id: string }>();
  const tareaEditando = useUIStore(s => s.tareaEditando);

  if (!id) return <div>No se encontró el tablero.</div>;

  return (
    <div>
      <h2>Tablero {id}</h2>
      <NuevoTareaForm tableroId={id} />
      {tareaEditando ? <EditarTareaForm /> : <TareaList tableroId={id} />}
    </div>
  );
}
