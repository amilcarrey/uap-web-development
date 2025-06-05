import React, { useState, useEffect } from 'react';
import { useTareas } from '../hooks/useTareas';
import { useAppStore } from '../store/appStore';
import TareaItem from './TareaItem';

interface Props {
  page: number;
}

const TareaList: React.FC<Props> = ({ page }) => {
  const { filtro } = useAppStore();
  const { data, isLoading, error } = useTareas(page);
  const [minLoading, setMinLoading] = useState(false);

  console.log('TareaList render:', { page, isLoading, data, minLoading });

  // Forzar un retraso mínimo de 1000ms para el spinner
  useEffect(() => {
    console.log('TareaList useEffect triggered with isLoading:', isLoading);
    if (isLoading && !minLoading) {
      setMinLoading(true);
      const timer = setTimeout(() => {
        console.log('TareaList minLoading timer expired');
        setMinLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minLoading]);

  if (isLoading || minLoading) return <div className="loading-spinner">Cargando...</div>;
  if (error) return <div>Loading failed</div>;
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