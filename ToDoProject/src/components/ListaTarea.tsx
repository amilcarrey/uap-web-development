import Tarea from './Tarea';
import Paginacion from './Paginacion';
import { useTareas } from '../hooks/useTareas'; 
import { useClientStore } from '../store/clientStore';

interface ListaTareasProps {
  tableroAlias?: string;
}

export default function ListaTareas({ tableroAlias }: ListaTareasProps) {
  const { paginaActual, filtroActual } = useClientStore();
  
  const { data, isLoading, error } = useTareas(tableroAlias, filtroActual);

  if (isLoading) return <p className="text-yellow-400 text-center">Cargando tareas...</p>;
  if (error) return <p className="text-red-400 text-center">Error al cargar tareas</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="lista-tareas-container">
        <div className="space-y-2">
          {data?.tareas.map((tarea: { id: any; descripcion?: string; completada?: boolean; }) => (
            <Tarea
              key={tarea.id}
              tarea={{
                id: tarea.id,
                descripcion: tarea.descripcion ?? '',
                completada: tarea.completada ?? false,
              }}
            />
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