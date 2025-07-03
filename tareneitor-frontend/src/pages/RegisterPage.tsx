import AuthForm from "../components/AuthForm";
import { registerUser } from "../api/auth";
import type { AuthFormData } from "../types/auth";
import { useNavigate } from "react-router-dom";

// Componente de página de registro de usuario
export function RegisterPage() {
    const navigate = useNavigate();

    // Maneja el registro del usuario
    const handleRegister = async (data: AuthFormData) => {
        try {
            await registerUser(data); // Llama a la API para registrar el usuario
            alert("Registro exitoso"); // Notifica éxito
            navigate("/login"); // Redirige al login
        } catch (error: any) {
            alert(error.message || "Error al registrar"); // Notifica error
        }
    };

    return (
        <div>
            {/* Formulario de autenticación reutilizable para registro */}
            <AuthForm
                onSubmit={handleRegister}
                title="Registrarse"
                submitText="Crear cuenta"
                includeUsername 
            />
        </div>
    );
}
