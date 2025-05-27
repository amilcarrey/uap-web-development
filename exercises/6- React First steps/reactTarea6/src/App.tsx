import { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "activa" | "completada">("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/task");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    //Valida que el imput no este vacio
    e.preventDefault();
    if (!newTask.trim()) {
      alert("Por favor, ingresa una tarea");
      return;
    }

    try {
      //Envia peticion POST al servidor
      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTask }),
      });

      if (!response.ok) {
        throw new Error("Error al agragar una tarea");
      }

      //Recibe la respuesta del servidor, y agrega la tarea a la lista.
      const data = await response.json();
      setTasks([...tasks, data]);

      //Recargar todas las tareas
      await fetchTasks();

      //Limpia el input
      setNewTask("");
    } catch (error) {
      console.error("Error al agregar una tarea:", error);
      alert("Error al agregar la tarea");
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      //Envia peticion PUT al servidor
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar tarea");
      }

      //Recibe la respuesta del servidor, y actualiza la tarea en la lista.
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, completed } : task))
      );

      //Recargar todas las tareas
      await fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      //Envia peticion DELETE al servidor
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar tarea");
      }

      //Recibe la respuesta del servidor, y elimina la tarea de la lista.
      setTasks(tasks.filter((task) => task.id !== id));

      //Recargar todas las tareas
      await fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const clearCompletedTasks = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/task/completed", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar tareas completadas");
        }

        const data = await response.json();
        setTasks(data.remainingTasks);

    } catch (error) {
        console.error("Error al eliminar tareas completadas:", error);
        alert("Error al eliminar tareas completadas");
    }
};

  //Funcion para filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "activa") return !task.completed;
    if (filter === "completada") return task.completed;
    return true; //all
  });

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 mx-auto max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4 p-4">
          TODO - REACT Tarea 6
        </h1>
        <form className="flex justify-center mb-4 p-2" onSubmit={addTask}>
          <input
            className="border border-gray-300 rounded-md mr-2 px-4 py-2 focus:outline-none focus:border-green-500"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask(e as any);
              }
            }}
            placeholder="Agregar nueva tarea"
            required
          />
          <button
            className="bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded-full"
            type="submit"
          >
            Agregar
          </button>
        </form>
        <ul className="list-none p-0">
          {filteredTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => toggleTask(task.id, e.target.checked)}
                  className="mr-2"
                />
                <span className={task.completed ? "line-through" : ""}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            className="mr-10 bg-gray-500 hover:bg-gray-700 text-white font-light py-0.5 px-2 rounded mt-2"
            onClick={clearCompletedTasks}
          >
            Limpiar
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
              filter === "all" ? "bg-blue-100" : ""
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("activa")}
            className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
              filter === "activa" ? "bg-blue-100" : ""
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFilter("completada")}
            className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
              filter === "completada" ? "bg-blue-100" : ""
            }`}
          >
            Completadas
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
