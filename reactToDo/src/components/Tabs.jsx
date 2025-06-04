import { useState } from 'react';

export default function Tabs({ activeTab, onTabChange }) {
  const tabs = ['Personal', 'University', 'Work'];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}