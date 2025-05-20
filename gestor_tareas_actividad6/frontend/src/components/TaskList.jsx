import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete, filter }) => {
  return (
    <>
      <h2 className="titulo-secundario">Lista de Tareas</h2>
      <ul className="lista-tareas">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </>
  );
};

export default TaskList;