'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrarsePage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mensaje, setMensaje] = useState('');
    const router = useRouter();

    // setError simply sets the mensaje state
    function setError(msg: string) {
        setMensaje(msg);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:4000/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, contraseña }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Error desconocido');
                return;
            }

            // Redirigir al login
            router.push('/login');
        } catch (err) {
            console.error('Error al registrar:', err);
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4 text-gray-600">Registrarse</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border px-3 py-2 rounded text-gray-600"
                    required
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 rounded text-gray-600"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="border px-3 py-2 rounded text-gray-600"
                    required
                />
                <button type="submit" className="bg-cyan-700 text-white py-2 rounded">
                    Registrarme
                </button>
            </form>
            {mensaje && <p className="mt-4 text-sm text-center">{mensaje}</p>}
        </div>
    );
}
function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

