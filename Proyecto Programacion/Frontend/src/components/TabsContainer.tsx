//src\components\TabsContainer.tsx

import { TabButton } from './TabButton';
import type { UserRole } from '../types/permissions';

// Definición de las props que recibe el contenedor de pestañas
export interface Props {
  tabs: Array<{ id: string; title: string; userRole?: UserRole }>;  // Array con las pestañas, cada una con un id y un título
  activeTab: string;                           // ID de la pestaña que está activa en este momento
  setActiveTab: (id: string) => void;          // Función para cambiar la pestaña activa, recibe el id de la nueva pestaña
  onAddTab: () => void;                        // Función para agregar una nueva pestaña (no se usa en este componente)
  onRemoveTab: (id: string) => void;           // Función para eliminar una pestaña (no se usa en este componente)
  onShareTab?: (id: string) => void; // Agregar callback para compartir
}

/**
 * Componente TabsContainer
 * Este componente es el contenedor que muestra la barra de pestañas.
 * Se encarga de renderizar un TabButton por cada pestaña que recibe,
 * marcando cuál está activa y permitiendo cambiar de pestaña.
 * También incluye un botón especial para agregar nuevas pestañas.
 */
export function TabsContainer({ tabs, activeTab, setActiveTab, onAddTab, onRemoveTab, onShareTab }: Props) {
  return (
    <div className="tabs flex mb-[20px] items-center gap-[5px] overflow-x-auto whitespace-nowrap pb-[10px]">
      {/* Renderiza un TabButton por cada pestaña */}
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}                      // Key única para React
          tabId={tab.id}                   // ID de la pestaña, para identificar el botón
          label={tab.title}                // Texto visible en el botón
          isActive={tab.id === activeTab}  // Marca el botón como activo si coincide con la pestaña activa
          userRole={tab.userRole} // Pasar el rol del usuario
          onClick={() => setActiveTab(tab.id)} // Cambia la pestaña activa cuando se hace clic
          onRemove={() => onRemoveTab(tab.id)} // Permite eliminar la pestaña al hacer clic en el botón de eliminar
          onShare={onShareTab ? () => onShareTab(tab.id) : undefined} // Pasar callback de compartir
        />
      ))}

      {/* Botón especial para agregar nuevas pestañas */}
      <TabButton isAddButton label="+" onClick={onAddTab}/>
    </div>
  );
}
