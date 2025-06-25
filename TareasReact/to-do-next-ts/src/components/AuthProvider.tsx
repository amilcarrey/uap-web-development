import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useConfigStore } from '@/stores/configStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // traigo usuario y funciones del store
  const usuario = useUserStore((state) => state.usuario)
  const setUsuario = useUserStore((state) => state.setUsuario)
  const cargarConfiguracion = useConfigStore((state) => state.cargarConfiguracion)

  useEffect(() => {
    // intento cargar usuario si no hay
    const cargarUsuario = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/test', {
          credentials: 'include',
        })

        if (res.ok) {
          // si hay usuario, lo guardo en el store
          const user = await res.json()
          setUsuario({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: '',
          })
          await cargarConfiguracion()
        }
      } catch (err) {
        // si no hay sesión, muestro por consola
        console.log('No hay sesión activa')
      }
    }

    if (!usuario) {
      cargarUsuario()
    }
  }, [usuario])

  // devuelvo los hijos envueltos en el provider
  return <>{children}</>
}
