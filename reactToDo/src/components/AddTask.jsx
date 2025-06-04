import { useState } from 'react';
import styles from './AddTask.module.css';

export default function AddTask({ onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskText.trim()) {
      setError('Por favor ingresa una tarea');
      return;
    }
    
    onAddTask(taskText);
    setTaskText('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Añadir nueva tarea..."
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <button type="submit" className={styles.button}>
        Añadir Tarea
      </button>
    </form>
  );
}