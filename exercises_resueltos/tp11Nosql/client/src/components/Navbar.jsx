import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Book Discovery</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/profile">Profile ({user.name})</Link>
                        <button onClick={logout} className="nav-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
            <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        .nav-brand a {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .nav-links a {
          color: #666;
          text-decoration: none;
          font-weight: 500;
        }
        .nav-links a:hover {
          color: #007bff;
        }
        .nav-btn {
          background: none;
          border: 1px solid #dc3545;
          color: #dc3545;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .nav-btn:hover {
          background: #dc3545;
          color: white;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
