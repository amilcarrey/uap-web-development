import Header from './components/Header';
import ListaTareas from './components/ListaTarea';
import FiltroTareas from './components/FiltroTarea';
import AgregarTarea from './components/AgregarTarea';
import Notificacion from './components/Notificacion';
import EliminarCompletadas from './components/EliminarCompletadas';
import { useClientStore } from './store/clientStore';
import './App.css';
import './index.css';

function App() {
  const { toast, cerrarToast } = useClientStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200 h-screen w-screen">
      <div className="flex flex-col items-center space-y-2">
        <Header />
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded">
          <p className="font-medium">Selecciona un tablero  para utilizar el ToDo</p>
        </div>
        
        <div className="opacity-50 pointer-events-none">
          <AgregarTarea />
          <FiltroTareas />
          <ListaTareas />
          <EliminarCompletadas />
        </div>
      </div>
      {toast && <Notificacion {...toast} onCerrar={cerrarToast} />}
    </div>
  );
}

export default App;