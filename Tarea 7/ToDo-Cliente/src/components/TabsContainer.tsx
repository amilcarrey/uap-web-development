//src\components\TabsContainer.tsx

import { TabButton } from './TabButton';

// Definición de las props que recibe el contenedor de pestañas
export interface Props {
  tabs: Array<{ id: string; title: string }>;  // Array con las pestañas, cada una con un id y un título
  activeTab: string;                           // ID de la pestaña que está activa en este momento
  setActiveTab: (id: string) => void;         // Función para cambiar la pestaña activa, recibe el id de la nueva pestaña
}

/**
 * Componente TabsContainer
 * Este componente es el contenedor que muestra la barra de pestañas.
 * Se encarga de renderizar un TabButton por cada pestaña que recibe,
 * marcando cuál está activa y permitiendo cambiar de pestaña.
 * También incluye un botón especial para agregar nuevas pestañas.
 */
export function TabsContainer({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <div className="tabs flex mb-[20px] items-center gap-[5px] overflow-x-auto whitespace-nowrap pb-[10px]">
      {/* Renderiza un TabButton por cada pestaña */}
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}                      // Key única para React
          tabId={tab.id}                   // ID de la pestaña, para identificar el botón
          label={tab.title}                // Texto visible en el botón
          isActive={tab.id === activeTab}  // Marca el botón como activo si coincide con la pestaña activa
          onClick={() => setActiveTab(tab.id)} // Cambia la pestaña activa cuando se hace clic
        />
      ))}

      {/* Botón especial para agregar nuevas pestañas */}
      <TabButton isAddButton label="+" />
    </div>
  );
}
