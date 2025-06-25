'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import e from 'cors';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const usuario = useUserStore((state) => state.usuario);
  const setUsuario = useUserStore((state) => state.setUsuario);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/test', {
          credentials: 'include',
        });

        if (res.ok) {
          const user = await res.json();
          setUsuario({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: '', // ya no se usa
          });
        }
      } catch (err) {
        console.log('No hay sesión activa');
      }
    };

    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, setUsuario]);

  return <>{children}</>;
}

