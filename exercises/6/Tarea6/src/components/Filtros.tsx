import React from 'react';
import { useAppStore } from '../store/appStore';

const Filtros: React.FC = () => {
  const { filtro, setFiltro } = useAppStore();

  return (
    <div className="filters">
      <button
        onClick={() => setFiltro('all')}
        className={filtro === 'all' ? 'active' : ''}
      >
        Todas
      </button>
      <button
        onClick={() => setFiltro('completed')}
        className={filtro === 'completed' ? 'active' : ''}
      >
        Completadas
      </button>
      <button
        onClick={() => setFiltro('incomplete')}
        className={filtro === 'incomplete' ? 'active' : ''}
      >
        No Completadas
      </button>
    </div>
  );
};

export default Filtros;