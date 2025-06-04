export default function Tabs({ activeTab, onTabChange }) {
  const tabs = ['Personal', 'Universidad', 'Work'];
  
  const getTabColor = (tab) => {
    switch(tab) {
      case 'Personal': return 'primary';
      case 'Universidad': return 'secondary';
      case 'Work': return 'success';
      default: return 'gray';
    }
  };

  return (
    <div className="flex justify-center space-x-4 mb-6">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`
            px-4 py-2 rounded-full font-medium transition-colors
            ${activeTab === tab 
              ? `bg-${getTabColor(tab)} text-white shadow-md` 
              : `bg-gray-100 text-gray-700 hover:bg-gray-200`}
          `}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}