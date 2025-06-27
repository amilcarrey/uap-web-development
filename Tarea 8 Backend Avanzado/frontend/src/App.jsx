import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

axios.defaults.withCredentials = true;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ refetchInterval: 10, uppercaseContent: false });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get("/api/auth/check");
      setLoggedIn(true);
      fetchBoards();
      fetchSettings();
    } catch {
      setLoggedIn(false);
    }
  };

  const login = async () => {
    setError("");
    try {
      await axios.post("/api/auth/login", { email, password });
      setLoggedIn(true);
      fetchBoards();
      fetchSettings();
    } catch {
      setError("Error de login");
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setLoggedIn(false);
    setBoards([]);
    setEmail("");
    setPassword("");
  };

  const fetchBoards = async () => {
    try {
      const res = await axios.get("/api/boards");
      setBoards(res.data);
    } catch {
      setError("Error al obtener tableros");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      setSettings(res.data);
    } catch {
      // Opcional: mostrar error
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      await axios.post("/api/boards", { name: newBoardName });
      setNewBoardName("");
      fetchBoards();
    } catch {
      setError("Error al crear tablero");
    }
  };

  const saveSettings = async () => {
    try {
      await axios.put("/api/settings", settings);
      alert("Configuración guardada");
      setShowSettings(false);
    } catch {
      alert("Error al guardar configuración");
    }
  };

  if (!loggedIn) {
    if (showRegister) {
      return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20 }}>
          <h2>Registro</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <button onClick={async () => {
            try {
              await axios.post("/api/auth/register", { email, password });
              alert("Usuario creado, ahora podés iniciar sesión.");
              setShowRegister(false);
            } catch {
              setError("Error al registrarse");
            }
          }} style={{ width: "100%", padding: 10 }}>
            Registrarse
          </button>
          <p>¿Ya tenés cuenta? <button onClick={() => setShowRegister(false)}>Iniciar sesión</button></p>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20 }}>
        <h2>Iniciar sesión</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button onClick={login} style={{ width: "100%", padding: 10 }}>
          Ingresar
        </button>
        <p>¿No tenés cuenta? <button onClick={() => setShowRegister(true)}>Registrarse</button></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20 }}>
      <h2>Mis tableros</h2>
      <button onClick={logout} style={{ marginBottom: 10 }}>Cerrar sesión</button>
      <button onClick={() => setShowSettings(true)} style={{ marginLeft: 10 }}>Configuración</button>

      {showSettings ? (
        <div style={{ marginTop: 20 }}>
          <h3>Configuración de usuario</h3>
          <label>
            Intervalo de actualización (segundos):
            <input
              type="number"
              value={settings.refetchInterval}
              onChange={(e) =>
                setSettings({ ...settings, refetchInterval: parseInt(e.target.value) })
              }
              style={{ marginLeft: 10 }}
            />
          </label>
          <br />
          <label>
            Descripciones en mayúsculas:
            <input
              type="checkbox"
              checked={settings.uppercaseContent}
              onChange={(e) =>
                setSettings({ ...settings, uppercaseContent: e.target.checked })
              }
              style={{ marginLeft: 10 }}
            />
          </label>
          <br />
          <button onClick={saveSettings} style={{ marginTop: 10 }}>
            Guardar configuración
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 20 }}>
            <input
              placeholder="Nuevo tablero"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              style={{ padding: 8, width: "70%" }}
            />
            <button onClick={createBoard} style={{ padding: 8, marginLeft: 10 }}>
              Crear
            </button>
          </div>
          <ul style={{ marginTop: 20 }}>
            {boards.map((board) => (
              <li key={board.id}>
                {board.name} - {board.access?.role || "Sin rol"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
