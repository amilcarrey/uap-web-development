import { Routes, Route, Navigate } from 'react-router-dom';
import TaskManager from './components/TaskManager';
import ConfiguracionPage from './components/ConfiguracionPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tablero/1" replace />} />
      <Route path="/tablero/:slug" element={<TaskManager />} />
      <Route path="/configuracion" element={<ConfiguracionPage />} />
    </Routes>
  );
};

export default App;
