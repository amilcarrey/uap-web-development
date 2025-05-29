import { useTareasQuery } from '../hooks/useTareas';
import { useClientStore } from '../store/clientStore';
import Tarea from './Tarea';
import Paginacion from './Paginacion';

export default function ListaTareas() {
  const { paginaActual, filtroActual } = useClientStore();
  const { data, isLoading, error } = useTareasQuery(paginaActual, filtroActual, 5);

  if (isLoading) return <p className="text-yellow-400 text-center">Cargando tareas...</p>;
  if (error) return <p className="text-red-400 text-center">Error al cargar tareas</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="lista-tareas-container">
        <div className="space-y-2">
          {data?.tareas.map((tarea) => (
            <Tarea key={tarea.id} tarea={tarea} />
          ))}
        </div>
      </div>
      
      {data?.totalPaginas && data.totalPaginas > 1 && (
        <div className="mt-4 flex-shrink-0">
          <Paginacion totalPaginas={data.totalPaginas} />
        </div>
      )}
    </div>
  );
}