import { motion } from 'framer-motion';

export default function Tabs({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex border-b mb-6 relative">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-3 font-medium text-sm relative z-10 ${
            activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}