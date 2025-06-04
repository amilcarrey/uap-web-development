export default function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li key={index} className="task-item">
          <input type="checkbox" className="task-checkbox" />
          <span className="task-text">{task}</span>
        </li>
      ))}
    </ul>
  );
}