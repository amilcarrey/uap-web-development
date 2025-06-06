import Filtros from './components/Filtros';
import ListaTarea from './components/ListaTarea';
import TareaNueva from './components/TareaNueva';
import { useTareas } from './hooks/useTareas';
import { useTareaStore } from './store/tareaStore';
import './App.css';

function App() {
  const { filtro, setFiltro } = useTareaStore();

  // 👉 tableroId fijo por ahora y página 1
  const tableroId = '1';
  const page = 1;

  const {
    tareasQuery: { data: tareas = [], isLoading, isError },
    addTarea,
  } = useTareas(tableroId, page);

  const agregarTarea = (texto: string) => {
    if (!texto.trim()) return;
    addTarea.mutate(texto);
  };

  const filtrarTareas = tareas.filter((t) => {
    if (filtro === 'completas') return t.completed;
    if (filtro === 'incompletas') return !t.completed;
    return true;
  });

  return (
    <>
      <header>
        <h1 className="encabezado">TO-DO</h1>
      </header>

      <div className="container">
        <h4 id="subencabezado">Personal</h4>
        <h4 id="subencabezado">Professional</h4>
      </div>

      <TareaNueva onAgregar={agregarTarea} />

      <Filtros filtro={filtro} setFiltro={setFiltro} />

      <div className="to-do">
        {isLoading && <p>Cargando tareas...</p>}
        {isError && <p>Error al cargar tareas</p>}

        {!isLoading && !isError && (
          <ListaTarea tareas={filtrarTareas} />
        )}

        <p className="clear-completed">Clear Completed</p>
      </div>
    </>
  );
}

export default App;
