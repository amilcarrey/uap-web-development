import { TabButton } from './TabButton';

export interface Props {
  tabs: Array<{ id: string; title: string }>;
  activeTab: string;
  setActiveTab: (id: string) => void;
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
}

export function TabsContainer({ tabs, activeTab, setActiveTab, onAddTab, onRemoveTab }: Props) {
  return (
    <div className="tabs flex mb-[20px] items-center gap-[5px] overflow-x-auto whitespace-nowrap pb-[10px]">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tabId={tab.id}
          label={tab.title}
          isActive={tab.id === activeTab}
          onClick={() => setActiveTab(tab.id)}
          onRemove={() => onRemoveTab(tab.id)}
        />
      ))}

      <TabButton
        isAddButton
        label="+"
        onClick={onAddTab}
      />
    </div>
  );
}
