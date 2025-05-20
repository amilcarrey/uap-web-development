// Importa StrictMode, una herramienta de desarrollo que ayuda a detectar problemas potenciales en la aplicación React
import { StrictMode } from 'react'

// Importa la función createRoot para iniciar la aplicación en el DOM utilizando el nuevo API de React 18+
import { createRoot } from 'react-dom/client'

// Importa los estilos globales desde el archivo CSS
import './index.css'

// Importa el componente principal de la aplicación
import App from './App.tsx'

// Crea la raíz de la aplicación React e inyecta el componente App dentro del elemento con id "root" en el DOM
createRoot(document.getElementById('root')!).render(
  // Envuelve la aplicación en StrictMode para habilitar advertencias y comprobaciones adicionales en desarrollo
  <StrictMode>
    <App />
  </StrictMode>,
)
