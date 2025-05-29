// src/App.tsx
import FormularioAgregarTarea from "./components/FormularioAgregarTarea";
import ListaDeTareas from "./components/ListaDeTareas";
import Filtros from "./components/Filtros";
import BorrarCompletadas from "./components/BorrarCompletadas";
import ToastContainer from "./components/ToastContainer";


const App = () => {
  return (
    <main className="min-h-screen bg-pink-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
        Lista de Tareas
      </h1>

      <FormularioAgregarTarea />

      <Filtros />

      <ListaDeTareas />

      <BorrarCompletadas />

      <ToastContainer />

    </main>
  );
};

export default App;
