import { TabButton } from './TabButton';
import type { UserRole } from '../types/permissions';

// Props que recibe el contenedor de pestañas
export interface Props {
  tabs: Array<{ id: string; title: string; userRole?: UserRole }>; // Lista de pestañas con ID, título y rol
  activeTab: string;                          // ID de la pestaña actualmente activa
  setActiveTab: (id: string) => void;         // Función para cambiar la pestaña activa
  onAddTab: () => void;                       // Función para agregar una nueva pestaña
  onRemoveTab: (id: string) => void;          // Función para eliminar una pestaña
  onShareTab?: (id: string) => void;          // Función opcional para compartir una pestaña
}

/**
 * Componente TabsContainer
 * Renderiza una barra horizontal de pestañas con botones individuales.
 * Permite cambiar entre pestañas, agregar nuevas, eliminar o compartir.
 */
export function TabsContainer({
  tabs,
  activeTab,
  setActiveTab,
  onAddTab,
  onRemoveTab,
  onShareTab
}: Props) {
  return (
    <div className="tabs flex mb-5 items-center gap-1 overflow-x-auto whitespace-nowrap pb-2">
      {/* Renderiza un botón por cada pestaña */}
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}                            // Clave única para React
          tabId={tab.id}                          // ID de la pestaña
          label={tab.title}                       // Texto visible en el botón
          isActive={tab.id === activeTab}         // Marca como activa si coincide con la pestaña actual
          userRole={tab.userRole}                 // Rol del usuario (para permisos)
          onClick={() => setActiveTab(tab.id)}    // Cambia la pestaña activa
          onRemove={() => onRemoveTab(tab.id)}    // Elimina la pestaña
          onShare={onShareTab ? () => onShareTab(tab.id) : undefined} // Comparte la pestaña si se proporciona
        />
      ))}

      {/* Botón para agregar una nueva pestaña */}
      <TabButton isAddButton label="+" onClick={onAddTab} />
    </div>
  );
}
