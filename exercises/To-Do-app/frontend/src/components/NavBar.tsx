import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TaskBoard</Link>
        <div>
          {user ? (
            <>
              <Link to="/boards">Tableros</Link>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}