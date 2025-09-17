"use client";
import React, { useEffect } from "react";
import { useUsuario } from "../hooks/useUsuario";
import { useRouter } from "next/navigation";

// Header: solo email y botón
export function PerfilUsuarioHeader() {
  const { usuario, loading, error, fetchUsuario } = useUsuario();
  const router = useRouter();
  useEffect(() => { fetchUsuario(); }, []);
  if (loading) return <span>Cargando...</span>;
  if (error) return <span>Error</span>;
  if (!usuario) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "1.1rem", color: "#3d001a", fontWeight: 500, letterSpacing: "0.5px" }}>
      <span>Usuario: <b style={{ color: "#e75480" }}>{usuario.mail}</b></span>
      <button
        onClick={() => router.push("/perfil")}
        style={{ background: "#e75480", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px #e7548033" }}
      >Ir al perfil</button>
    </div>
  );
}

// Perfil completo solo en /perfil
export default function PerfilUsuario() {
  const { usuario, loading, error, fetchUsuario, editarMail, eliminarFavorito } = useUsuario();
  const [editando, setEditando] = React.useState(false);
  const [nuevoMail, setNuevoMail] = React.useState("");
  useEffect(() => { fetchUsuario(); }, []);
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!usuario) return <p>No hay datos de usuario.</p>;
  const handleLogout = () => {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <section style={{ borderBottom: "2px solid #e75480", paddingBottom: "1rem" }}>
        <h2 style={{ color: "#e75480", fontWeight: 700, fontSize: "2rem", marginBottom: "0.5rem" }}>Perfil</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1.1rem", color: "#3d001a" }}>
            <b>Email:</b> {usuario.mail}
          </span>
          {editando ? (
            <>
              <input
                type="email"
                value={nuevoMail}
                onChange={e => setNuevoMail(e.target.value)}
                style={{ padding: "0.3rem 0.7rem", borderRadius: 6, border: "1px solid #e75480" }}
              />
              <button
                style={{ background: "#e75480", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 1rem", fontWeight: 600, cursor: "pointer" }}
                onClick={() => { editarMail(nuevoMail); setEditando(false); }}
              >Guardar</button>
              <button onClick={() => setEditando(false)} style={{ background: "#eee", border: "none", borderRadius: 6, padding: "0.3rem 1rem", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
            </>
          ) : (
            <>
              <button
                style={{ background: "#e75480", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 1rem", fontWeight: 600, cursor: "pointer" }}
                onClick={() => { setEditando(true); setNuevoMail(usuario.mail); }}
              >Editar mail</button>
              <button
                style={{ background: "#888", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 1rem", fontWeight: 600, cursor: "pointer", marginLeft: "1rem" }}
                onClick={handleLogout}
              >Cerrar sesión</button>
            </>
          )}
        </div>
      </section>
      <section>
        <h3 style={{ color: "#e75480", fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>Favoritos</h3>
        {usuario.favoritos?.length === 0 ? (
          <p style={{ color: "#888" }}>No tienes libros favoritos.</p>
        ) : (
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "1rem", listStyle: "none", padding: 0 }}>
            {usuario.favoritos.map((fav: any) => (
              <li key={fav._id} style={{ background: "#ffe4ee", border: "1px solid #e75480", borderRadius: 8, padding: "1rem", minWidth: 180, textAlign: "center", boxShadow: "0 1px 4px #e7548033" }}>
                {fav.libro?.imagen && (
                  <img src={fav.libro.imagen} alt={fav.libro.titulo} style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #e75480", marginBottom: "0.5rem" }} />
                )}
                <div style={{ fontWeight: 700, color: "#e75480", fontSize: "1.1rem" }}>{fav.libro?.titulo || fav.libroId}</div>
                {fav.libro?.autores && <div style={{ color: "#3d001a", fontSize: "0.95rem" }}>{fav.libro.autores.join(", ")}</div>}
                <button
                  style={{ marginTop: "0.5rem", background: "#e75480", color: "#fff", border: "none", borderRadius: 6, padding: "0.3rem 1rem", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => eliminarFavorito(fav.libroId)}
                >Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 style={{ color: "#e75480", fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>Historial de reseñas</h3>
        {usuario.historialResenas?.length === 0 ? (
          <p style={{ color: "#888" }}>No tienes reseñas.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {usuario.historialResenas.map((res: any) => (
              <li key={res._id} style={{ background: "#fff0f6", border: "1px solid #e75480", borderRadius: 8, marginBottom: "0.7rem", padding: "0.7rem 1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                {res.libro?.imagen && (
                  <img src={res.libro.imagen} alt={res.libro.titulo} style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #e75480" }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#e75480", fontSize: "1.1rem" }}>{res.libro?.titulo || res.libro?.id}</div>
                  {res.libro?.autores && <div style={{ color: "#3d001a", fontSize: "0.95rem" }}>{res.libro.autores.join(", ")}</div>}
                  <div style={{ marginTop: "0.3rem", color: "#3d001a" }}>{res.texto}</div>
                  <div style={{ color: "#e75480", fontWeight: 600 }}>Rating: {res.rating}</div>
                  <div style={{ color: "#3d001a", fontSize: "0.95rem" }}>
                    👍 {res.likes} &nbsp; 👎 {res.dislikes}
                  </div>
                  <div style={{ color: "#888", fontSize: "0.9rem" }}>
                    Votos: {Array.isArray(res.votaciones) ? res.votaciones.length : 0}
                  </div>
                  <div style={{ color: "#888", fontSize: "0.85rem" }}>
                    Fecha: {new Date(res.fecha).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
