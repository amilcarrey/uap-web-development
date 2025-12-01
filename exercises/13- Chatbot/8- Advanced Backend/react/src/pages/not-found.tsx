import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function NotFoundPage() {
    const { user } = useAuth()
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex gap-4">
                {user ? (
                    // ✅ Usuario autenticado: mostrar enlaces a la app
                    <>
                        <Link
                            to="/boards"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Go to Boards
                        </Link>
                        <Link
                            to="/settings"
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                        >
                            Settings
                        </Link>
                    </>
                ) : (
                    // ✅ Usuario NO autenticado: mostrar enlaces públicos
                    <>
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
