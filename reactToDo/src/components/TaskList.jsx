import styles from './TaskList.module.css';

export default function TaskList({ tasks, onToggleCompletion, onDeleteTask }) {
  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <li key={task.id} className={styles.taskItem}>
          <div className={styles.taskContent}>
            <input
              type="checkbox"
              className={styles.taskCheckbox}
              checked={task.completed}
              onChange={() => onToggleCompletion(task.id)}
            />
            <span 
              className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}
            >
              {task.text}
            </span>
          </div>
          <button 
            className={styles.deleteButton}
            onClick={() => onDeleteTask(task.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}