import { useEffect, useState } from "react";
import {
    fetchTablerosPropios,
    fetchTablerosCompartidos,
    createTablero,
    updateTablero,
    deleteTablero,
    compartirTablero,
} from "../api/tableros";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header"; // Importa el Header

// Definición del tipo Tablero
type Tablero = {
    id_tablero: number;
    nombre: string;
    descripcion?: string;
};

export default function HomePage() {
    // Estados para tableros propios y compartidos
    const [tablerosPropios, setTablerosPropios] = useState<Tablero[]>([]);
    const [tablerosCompartidos, setTablerosCompartidos] = useState<Tablero[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Estados para crear tablero
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaDescripcion, setNuevaDescripcion] = useState("");

    // Estados para editar tablero
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editNombre, setEditNombre] = useState("");
    const [editDescripcion, setEditDescripcion] = useState("");

    // Estados para compartir tablero
    const [compartirId, setCompartirId] = useState<number | null>(null);
    const [correoCompartir, setCorreoCompartir] = useState("");
    const [permiso, setPermiso] = useState<"lector" | "editor">("lector");

    // Estado para mostrar/ocultar formulario de creación
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Contexto de autenticación y navegación
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirige a login si no hay usuario autenticado
    useEffect(() => {
        if (!authLoading && !user) navigate("/login");
    }, [authLoading, user, navigate]);

    // Carga los tableros propios y compartidos
    const cargarTableros = async () => {
        try {
            setLoading(true);
            const propios = await fetchTablerosPropios();
            const compartidos = await fetchTablerosCompartidos();
            setTablerosPropios(propios);
            setTablerosCompartidos(compartidos);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Carga tableros cuando hay usuario
    useEffect(() => {
        if (user) cargarTableros();
    }, [user]);

    // Expande o colapsa un tablero
    const toggleExpand = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
        setEditandoId(null);
        setCompartirId(null);
    };

    // Maneja la creación de un tablero
    const handleCrearTablero = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTablero({ nombre: nuevoNombre, descripcion: nuevaDescripcion });
            setNuevoNombre("");
            setNuevaDescripcion("");
            setMostrarFormulario(false);
            await cargarTableros();
        } catch (err: any) {
            alert("Error al crear tablero: " + err.message);
        }
    };

    // Maneja la edición de un tablero
    const handleEditar = async (id: number) => {
        try {
            await updateTablero(id, { nombre: editNombre, descripcion: editDescripcion });
            setEditandoId(null);
            await cargarTableros();
        } catch (err: any) {
            alert("Error al editar tablero: " + err.message);
        }
    };

    // Maneja la eliminación de un tablero
    const handleEliminar = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este tablero?")) return;
        try {
            await deleteTablero(id);
            await cargarTableros();
        } catch (err: any) {
            alert("Error al eliminar tablero: " + err.message);
        }
    };

    // Maneja el compartir un tablero
    const handleCompartir = async (id_tablero: number) => {
        try {
            await compartirTablero(id_tablero, { correo: correoCompartir, permiso });
            alert("Tablero compartido exitosamente.");
            setCompartirId(null);
            setCorreoCompartir("");
            setPermiso("lector");
        } catch (error: any) {
            alert(error.message || "Error al compartir tablero");
        }
    };

    // Renderiza la lista de tableros
    const renderTableros = (tableros: Tablero[], propios: boolean) =>
        tableros.map((tablero) => (
            <div key={tablero.id_tablero} className="border rounded mb-2">
                <button
                    className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 font-semibold"
                    onClick={() => toggleExpand(tablero.id_tablero)}
                >
                    {tablero.nombre}
                </button>
                {expandedId === tablero.id_tablero && (
                    <div className="p-4 bg-white space-y-2">
                        {editandoId === tablero.id_tablero ? (
                            <>
                                {/* Formulario de edición */}
                                <input
                                    className="border border-black px-2 py-1 w-full"
                                    value={editNombre}
                                    onChange={(e) => setEditNombre(e.target.value)}
                                />
                                <textarea
                                    className="border border-black px-2 py-1 w-full"
                                    value={editDescripcion}
                                    onChange={(e) => setEditDescripcion(e.target.value)}
                                />
                                <button
                                    onClick={() => handleEditar(tablero.id_tablero)}
                                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setEditandoId(null)}
                                    className="bg-gray-500 text-white px-3 py-1 rounded"
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Detalles del tablero */}
                                <p className="text-gray-700 mb-2">{tablero.descripcion || "Sin descripción."}</p>
                                <button
                                    className="text-blue-600 hover:underline mr-4"
                                    onClick={() => navigate(`/tableros/${tablero.id_tablero}`)}
                                >
                                    Ver tablero
                                </button>
                                {propios && (
                                    <>
                                        {/* Botones de editar, eliminar y compartir */}
                                        <button
                                            className="text-yellow-600 hover:underline mr-4"
                                            onClick={() => {
                                                setEditandoId(tablero.id_tablero);
                                                setEditNombre(tablero.nombre);
                                                setEditDescripcion(tablero.descripcion || "");
                                                setCompartirId(null);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline mr-4"
                                            onClick={() => handleEliminar(tablero.id_tablero)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="text-purple-600 hover:underline"
                                            onClick={() => {
                                                setCompartirId(tablero.id_tablero);
                                                setCorreoCompartir("");
                                                setPermiso("lector");
                                                setEditandoId(null);
                                            }}
                                        >
                                            Compartir
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {/* Formulario para compartir tablero */}
                        {compartirId === tablero.id_tablero && (
                            <div className="mt-4 space-y-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Correo del usuario"
                                    value={correoCompartir}
                                    onChange={(e) => setCorreoCompartir(e.target.value)}
                                    className="w-full border border-black px-2 py-1 rounded text-black"
                                />
                                <select
                                    value={permiso}
                                    onChange={(e) => setPermiso(e.target.value as "lector" | "editor")}
                                    className="w-full border border-black px-2 py-1 rounded text-black"
                                >
                                    <option value="lector">Lector</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <button
                                    onClick={() => handleCompartir(tablero.id_tablero)}
                                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                >
                                    Compartir tablero
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ));

    // Muestra mensaje de carga o error
    if (authLoading || loading) return <p className="text-center mt-10">Cargando...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    // Render principal
    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto mt-10 p-4">
                <h1 className="text-3xl font-bold mb-6">Hola, {user?.nombre_usuario}</h1>

                {/* Formulario para crear nuevo tablero */}
                <div className="mb-8">
                    <button
                        onClick={() => setMostrarFormulario((prev) => !prev)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                    >
                        {mostrarFormulario ? "Ocultar formulario" : "Crear nuevo tablero"}
                    </button>

                    {mostrarFormulario && (
                        <form onSubmit={handleCrearTablero} className="space-y-2 mt-2">
                            <h2 className="text-2xl font-semibold">Nuevo tablero</h2>
                            <input
                                type="text"
                                required
                                placeholder="Nombre"
                                value={nuevoNombre}
                                onChange={(e) => setNuevoNombre(e.target.value)}
                                className="w-full border border-black px-3 py-2 rounded"
                            />
                            <textarea
                                placeholder="Descripción"
                                value={nuevaDescripcion}
                                onChange={(e) => setNuevaDescripcion(e.target.value)}
                                className="w-full border border-black px-3 py-2 rounded"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Crear tablero
                            </button>
                        </form>
                    )}
                </div>

                {/* Sección de tableros propios */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Tableros Propios</h2>
                    {tablerosPropios.length === 0 ? (
                        <p>No tienes tableros propios.</p>
                    ) : (
                        renderTableros(tablerosPropios, true)
                    )}
                </section>

                {/* Sección de tableros compartidos */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Tableros Compartidos</h2>
                    {tablerosCompartidos.length === 0 ? (
                        <p>No tienes tableros compartidos.</p>
                    ) : (
                        renderTableros(tablerosCompartidos, false)
                    )}
                </section>
            </div>
        </>
    );
}
