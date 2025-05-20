export default function TaskList() {
    // La carga de datos y las acciones se realizan con fetch
    // Segun la respuesta de esos fetch se actualizan estados de la app NO SE MODIFICA EL DOM A MANO
    // const handleTaskClick = (task) => {
    //     // Call the onTaskClick function passed as a prop
    //     await fetch("http://localhost:3000/api/toggle_task")
    // }
    const [tasks, setTasks] = useState([]);
  return (
   <ul id="task-list" class="space-y-2">
  {tasks.map(task => (
    <li
      class="flex items-center justify-between border-b py-2"
      data-id={task.id}
    >
      <form method="POST" action="/api/toggle_task" class="flex items-center flex-1">
        <input type="hidden" name="id" value={task.id} />
        <input
          type="checkbox"
          name="toggle"
          onchange="this.form.submit()"
          checked={task.completed}
          class="mr-3 w-5 h-5 accent-orange-500"
        />
        <span class={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
          {task.text}
        </span>
      </form>

      {/* <form method="POST" action="/api/delete_task"> */}
      <form onSubmit={(e)=> {console.log(e)}}>

        <input type="hidden" name="id" value={task.id} />
        <button
          type="submit"
          class="ml-3 text-red-500 hover:text-red-700 text-xl"
        >
          🗑
        </button>
      </form>
    </li>
  ))}
</ul>
  );
}