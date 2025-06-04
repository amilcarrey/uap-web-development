import styles from './TaskList.module.css';

export default function TaskList({ tasks }) {
  return (
    <ul className={styles.taskList}>
      {tasks.map((task, index) => (
        <li key={index} className={styles.taskItem}>
          <input type="checkbox" className={styles.taskCheckbox} />
          <span className={styles.taskText}>{task}</span>
        </li>
      ))}
    </ul>
  );
}