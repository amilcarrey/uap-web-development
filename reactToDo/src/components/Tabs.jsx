import styles from './Tabs.module.css';

export default function Tabs({ activeTab, onTabChange }) {
  const tabs = ['Personal', 'University', 'Work'];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}