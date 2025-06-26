import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogoutButton } from "./auth/LogoutButton";

export const NavBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {user ? (
        <>
          <Link to="/boards" style={{ marginRight: 10 }}>
            Tableros
          </Link>
          <Link to="/settings" style={{ marginRight: 10 }}>
            Configuración
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>
            Login
          </Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  );
};
