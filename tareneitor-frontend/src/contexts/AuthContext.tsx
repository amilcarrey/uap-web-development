import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../api/auth";

// Definición del tipo de usuario
type Usuario = {
    id_usuario: number;
    nombre_usuario: string;
    correo: string;
};

// Definición del tipo de contexto de autenticación
type AuthContextType = {
    user: Usuario | null; // Usuario autenticado o null si no hay sesión
    loading: boolean; // Indica si se está cargando el usuario
    logout: () => Promise<void>; // Función para cerrar sesión
    refreshUser: () => Promise<void>; // Función para refrescar el usuario
};

// Creación del contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null); // Estado del usuario
    const [loading, setLoading] = useState(true); // Estado de carga

    // Refresca el usuario actual desde la API
    const refreshUser = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data);
        } catch {
            setUser(null);
        }
    };

    // Cierra la sesión del usuario
    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    // Al montar el componente, intenta obtener el usuario actual
    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, []);

    // Provee el contexto a los componentes hijos
    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
