import { useParams } from "react-router-dom";
import FormularioAgregarTarea from "../components/FormularioAgregarTarea";
import ListaDeTareas from "../components/ListaDeTareas";
import Filtros from "../components/Filtros";
import BorrarCompletadas from "../components/BorrarCompletadas";
import ToastContainer from "../components/ToastContainer";
import { Link } from "react-router-dom";



const Tablero = () => {
  const { tableroId } = useParams();

  if (!tableroId) return <p>Tablero no encontrado</p>;

  return (    
        <div className="max-w-2xl mx-auto p-4">
      {/* Botón de configuración */}
      <div className="flex justify-end mb-4">
        <Link
          to="/configuracion"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Configuración ⚙️
        </Link>
      </div>

      <FormularioAgregarTarea tableroId={tableroId} />
      <Filtros />
      <ListaDeTareas tableroId={tableroId} />
      <BorrarCompletadas tableroId={tableroId} />
      <ToastContainer />
    </div>
  );
};

export default Tablero;
