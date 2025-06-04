import styles from './TaskFilters.module.css';

export default function TaskFilters({ currentFilter, onFilterChange, onClearCompleted }) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterButton} ${currentFilter === 'active' ? styles.active : ''}`}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button
          className={`${styles.filterButton} ${currentFilter === 'completed' ? styles.active : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </div>
      <button
        className={styles.clearButton}
        onClick={onClearCompleted}
      >
        Clear Completed
      </button>
    </div>
  );
}