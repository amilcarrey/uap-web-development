import { useClientStore } from '../store/clientStore';

export default function FiltroTareas() {
  const { filtroActual, setFiltroActual } = useClientStore();

  return (
    <div className="flex justify-center space-x-4 my-2">
      <button 
        onClick={() => setFiltroActual("todas")} 
        className={`boton-filtro ${filtroActual === 'todas' ? 'active' : ''}`}
      >
        Todas
      </button>
      <button 
        onClick={() => setFiltroActual("completadas")} 
        className={`boton-filtro ${filtroActual === 'completadas' ? 'active' : ''}`}
      >
        Terminadas
      </button>
      <button 
        onClick={() => setFiltroActual("pendientes")} 
        className={`boton-filtro ${filtroActual === 'pendientes' ? 'active' : ''}`}
      >
        Pendientes
      </button>
    </div>
  );
}