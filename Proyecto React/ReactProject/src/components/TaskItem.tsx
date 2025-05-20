import type { Task } from '../types';

type TaskItemProps = {
	task: Task;
	toggleTask: () => void;
	deleteTask: () => void;
};

export function TaskItem({
	task,// = { id: '', text: '', done: false },
	toggleTask,
	deleteTask,
}: TaskItemProps) {
  return (
		<li className="flex justify-between items-center border-b-[1px] p-[10px] border-[#ccc] px-4">
			<form method="POST" className="flex jusitify-between items-center w-[100%]" name="task-form" action="/api/completar">
				<div className="flex items-center g-[10px]">
					<label>
						<input type="hidden" name="task-id" value={task.id} />
						<button type="submit" className="text-[18px] cursor-pointer" name="task-btn" onClick={(e) => {
							e.preventDefault()
							toggleTask();
						}}>{task.done ? "✅" : "⬜"}</button>
						<span>{ task.text }</span>
					</label>
				</div>
			</form>
			<form method="POST" className="delete-form" name="delete-form" action="/api/eliminar/">
				<input type="hidden" name="task-id" value={task.id} />
				<button type="submit" className="text-[18px] cursor-pointer" name="delete-btn" onClick={(e) => {
					e.preventDefault()
					deleteTask();
				}}>🗑️</button>
			</form>
		</li>
  );
}