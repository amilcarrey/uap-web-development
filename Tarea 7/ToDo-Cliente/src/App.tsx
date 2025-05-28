// src\App.tsx

import { useState } from 'react';
import { Header } from './components/Header';               // Encabezado principal de la aplicación
import { TabsContainer } from './components/TabsContainer'; // Componente para mostrar las pestañas de categorías
import { TabContent } from './components/TabContent';       // Componente que representa el contenido de cada pestaña

// Estructura base de una pestaña: identificador y título visible
interface Tab {
  id: string;
  title: string;
}


// Pestañas predefinidas: una para tareas personales y otra para profesionales
const tabs: Tab[] = [
  { id: 'personal', title: 'Personal' },
  { id: 'professional', title: 'Profesional' },
];

/**
 * Componente principal de la aplicación
 */
export default function App() {
  // Estado que indica cuál pestaña está activa en este momento
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <>
      {/* Encabezado de la aplicación (título, logo, etc.) */}
      <Header />

      {/* Contenedor principal con estilo centrado y tarjeta */}
      <main style={{
        maxWidth: 600,
        margin: '20px auto',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>

        {/* Componente que renderiza las pestañas de navegación */}
        <TabsContainer
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Renderiza el contenido de cada pestaña */}
        {tabs.map(tab => (
          <TabContent
            key={tab.id}
            tabId={tab.id}
            title={tab.title}
            isActive={tab.id === activeTab}                 // Solo una pestaña está activa a la vez
          />
        ))}
      </main>
    </>
  );
}
