
type TaskProps = {
  task: { id: string; name: string; completed: boolean };
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;

};

function Task({ task, onComplete, onDelete }: TaskProps) {
  return (
    <li className="flex justify-between w-full p-7">
        <button type="submit" onClick={()=> onComplete(task.id)} className="w-6 h-6 border-2 border-blue-600 rounded-full  text-sm  text-blue-600 hover:bg-blue-100 cursor-pointer">
          {task.completed ? "✔" : ""}
        </button>
     
      <div className="flex-grow border-b-2 border-gray-300 text-center p-3.5">
        <label className={task.completed ? "line-through text-gray-500" : ""}>
          {task.name}
        </label>
      </div>

        <button type="submit"onClick={()=> onDelete(task.id)}>
          <i className="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-700" />
        </button>
    </li>




  )
}
export default Task; 