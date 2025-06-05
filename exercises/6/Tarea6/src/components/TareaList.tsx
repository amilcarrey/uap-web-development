import React from 'react';
import { useTareas } from '../hooks/useTareas';
import { useAppStore } from '../store/appStore';
import TareaItem from './TareaItem';

interface Props {
  page: number;
}

const TareaList: React.FC<Props> = ({ page }) => {
  const { filtro } = useAppStore();
  const { data, isLoading, error } = useTareas(page);

  console.log(`TareaList page ${page} data:`, data?.tareas);

  if (isLoading && !data) return <div>Cargando...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data?.tareas || data.tareas.length === 0) return <div>No hay tareas</div>;

  const tareasFiltradas = data.tareas.filter((t) =>
    filtro === 'all' ? true : filtro === 'completed' ? t.completed : !t.completed
  );

  return (
    <ul className="task-list">
      {tareasFiltradas.map((t) => (
        <TareaItem key={t.id} tarea={t} />
      ))}
    </ul>
  );
};

export default TareaList;