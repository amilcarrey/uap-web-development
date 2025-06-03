import React from "react";

interface TabItemProps {
  name: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const TabItem: React.FC<TabItemProps> = ({ name, isActive, onClick }) => {
  return (
    <li className="inline-block">
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 capitalize rounded ${
          isActive
            ? "bg-amber-900 text-amber-200 font-medium"
            : "text-slate-100 hover:bg-amber-800"
        }`}
      >
        {name}
      </button>
    </li>
  );
};

export default TabItem;
