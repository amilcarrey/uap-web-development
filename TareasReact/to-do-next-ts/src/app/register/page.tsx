'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrarsePage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mensaje, setMensaje] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje('');

        try {
            const res = await fetch('http://localhost:4000/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, contraseña }),
            });

            if (!res.ok) {
                const data = await res.json();
                setMensaje(data.error || 'Error desconocido');
                return;
            }

            router.push('/login');
        } catch (err) {
            setMensaje('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
            <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-2xl font-bold text-cyan-700 mb-1">Crear cuenta</h1>
                    <p className="text-gray-500 text-sm">Registrate para comenzar a organizar tus tareas</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2 border border-cyan-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-600"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-cyan-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-600"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        className="w-full px-4 py-2 border border-cyan-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-600"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-cyan-700 text-white font-semibold py-2 rounded hover:bg-cyan-800 transition"
                    >
                        Registrarme
                    </button>
                </form>
                {mensaje && (
                    <p className={`mt-4 text-sm text-center ${mensaje.includes('Error') || mensaje.includes('No se pudo') ? 'text-red-600' : 'text-green-600'}`}>
                        {mensaje}
                    </p>
                )}
                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tenés cuenta?{' '}
                    <a href="/login" className="text-cyan-700 hover:underline font-medium">
                        Iniciar sesión
                    </a>
                </div>
            </div>
        </div>
    );
}

