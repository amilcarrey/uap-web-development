import { Link } from 'react-router-dom';
import { useAuthStore } from './store/auth';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="container">
      <h1>Bienvenido a la App de Tableros</h1>
      {user ? (
        <div>
          <p>Hola, {user.name}!</p>
          <Link to="/boards">Ver mis tableros</Link><br />
          <Link to="/settings">Configuraciones</Link>
        </div>
      ) : (
        <div>
          <p>Por favor, inicia sesión o regístrate para comenzar.</p>
          <Link to="/login">Iniciar Sesión</Link><br />
          <Link to="/register">Registrarse</Link>
        </div>
      )}
    </div>
  );
}

export default App;