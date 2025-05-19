import { StrictMode } from 'react'//Dom virtual
import { createRoot } from 'react-dom/client'//Este es el DOM real
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
