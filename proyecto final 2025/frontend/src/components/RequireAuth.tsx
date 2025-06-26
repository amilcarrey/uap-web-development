import { useAuth } from "../context/auth-context"; 
import AuthForm from "./AuthForm";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-gray-600">Cargando sesión...</p>;
  if (!user) return <AuthForm />;

  return <>{children}</>;
}
