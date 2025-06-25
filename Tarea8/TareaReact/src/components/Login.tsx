import { useState } from "react"
import { Link } from "react-router-dom"


const BACKEND_URL = 'http://localhost:4321/api'

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })
        if (res.ok) {
            window.location.href = "/"
        } else {
            const data = await res.json().catch(() => ({}))
            setError(data.message || "Error al iniciar sesión")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="border rounded px-3 py-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="border rounded px-3 py-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <div className="text-red-500 text-center">{error}</div>}
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Ingresar
                </button>
                <p className="text-center mt-2">
                    ¿No tenés cuenta? <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link>
                </p>
            </form>
        </div>
    )
}