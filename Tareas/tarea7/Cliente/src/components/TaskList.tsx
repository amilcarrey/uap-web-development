import { TaskItem } from "./TaskItem";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Props {
  tasks: Task[];
  tabId: string;
}

export function TaskList({tasks, tabId}: Props){
return (
    <ul className="task-list bg-[antiquewhite] p-5 rounded-lg mb-5 list-none">
      {tasks.length ? tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          tabId={tabId}
        />
      )): null}
    </ul>
  );
}
