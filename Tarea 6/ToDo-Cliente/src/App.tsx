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

// Estructura base de una tarea: tiene id, texto, estado de completitud y pestaña a la que pertenece
interface Task {
  id: string;
  text: string;
  completed: boolean;
  tabId: string;
}

// Pestañas predefinidas: una para tareas personales y otra para profesionales
const tabs: Tab[] = [
  { id: 'personal', title: 'Personal' },
  { id: 'professional', title: 'Profesional' },
];

/**
 * Componente principal de la aplicación
 * Se encarga de manejar el estado global de pestañas activas y tareas.
 * También filtra las tareas según el filtro actual y la pestaña activa.
 */
export default function App() {
  // Estado que indica cuál pestaña está activa en este momento
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  // Filtro global de tareas: puede ser 'all', 'completed' o 'pending'
  const [currentFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Lista global de tareas (arranca vacía)
  const [tasks] = useState<Task[]>([]);

  /**
   * Filtra las tareas según dos criterios:
   * 1. Deben pertenecer a la pestaña activa.
   * 2. Deben coincidir con el filtro actual (todas, completadas o pendientes).
   */
  const filteredTasks = tasks.filter(task => {
    if (task.tabId !== activeTab) return false;
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true; // Si el filtro es 'all', se muestran todas las tareas de la pestaña activa
  });

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
            tasks={tab.id === activeTab ? filteredTasks : []} // Solo se pasan tareas a la pestaña activa
            currentFilter={currentFilter}
          />
        ))}
      </main>
    </>
  );
}
