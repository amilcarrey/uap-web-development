document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form") as HTMLFormElement;
  const taskInput = document.getElementById("task-input") as HTMLInputElement;
  const taskList = document.getElementById("task-list") as HTMLUListElement;
  const clearFilter = document.getElementById(
    "clear-filter"
  ) as HTMLButtonElement;
  const allFilter = document.getElementById("all-filter") as HTMLButtonElement;
  const activeFilter = document.getElementById(
    "active-filter"
  ) as HTMLButtonElement;
  const completedFilter = document.getElementById(
    "complete-filter"
  ) as HTMLButtonElement;

  interface Task {
    id: number;
    text: string;
    completed: boolean;
  }

  let tasks: Task[] = [];

  //AJAX: Tomar las tareas desde el servidor.
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/task");
      if (!response.ok) {
        throw new Error("HTTP error - status: " + response.status);
      }
      tasks = await response.json();
      renderTaskList();
    } catch (err) {
      console.error("Error fetching tasks:", err);
      taskList.innerHTML = "<li>Error fetching tasks</li>";
    }
  }

  //AJAX: Agregar una tarea al servidor.
 const addTask = async (content: string) => {
    const task: Task = {
      id: Math.floor(Math.random() * 1000),
      text: content,
      completed: false,
    };
    tasks.push(task);
  };

  //AJAX: Actualizar una tarea en el servidor.
  async function updateTask(id: number, completed: boolean) {
    try {
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        throw new Error("HTTP error - status: " + response.status);
      }
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      );
      renderTaskList();
    } catch (err) {
      console.error("Error updating task:", err);
      taskList.innerHTML = "<li>Error updating task</li>";
    }
  }

  //AJAX: Eliminar una tarea del servidor.
  async function deleteTask(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("HTTP error - status: " + response.status);
      }
      tasks = tasks.filter((task) => task.id !== id);
      renderTaskList();
    } catch (err) {
      console.error("Error deleting task:", err);
      taskList.innerHTML = "<li>Error deleting task</li>";
    }
  }

  // Renderizar la lista de tareas
  function renderTaskList(completed?: boolean) {
    taskList.innerHTML = "";
    let filteredTasks = [...tasks];

    if (completed !== undefined) {
      filteredTasks = tasks.filter((task) => task.completed === completed);
    }

    filteredTasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
              <li class="bg-gray-100 shadow-sm rounded-md py-2 px-4 my-2 justify-between items-center flex">
                  <input class="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500" type="checkbox" ${
                    task.completed ? "checked" : ""
                  } data-id="${task.id}">
                  <label class="ml-2">${task.text}</label>
                  <button class="bg-red-500 hover:bg-red-700 text-white font-light py-1 px-2 rounded" data-id="${
                    task.id
                  }">Delete</button>
                  <li/>
              `;
      taskList.appendChild(listItem);

      const checkbox = listItem.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      checkbox.addEventListener("change", (event) => {
        const id = parseInt(
          (event.target as HTMLInputElement).dataset.id || ""
        );
        updateTask(id, checkbox.checked);
      });

      const deleteButton = listItem.querySelector(
        "button"
      ) as HTMLButtonElement;
      deleteButton.addEventListener("click", () => {
        const id = parseInt(deleteButton.dataset.id || "");
        deleteTask(id);
      });
    });
  }

  //Progressive Enhacement: El form andaria incluso si JS no estuviera habilitado (mediante la pagina se recargue)
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      await addTask(taskText);
      taskInput.value = "";
    }
  });

  clearFilter.addEventListener("click", async () => {
    const tareasCompletadasIds = tasks
      .filter((t) => t.completed)
      .map((t) => t.id);
    await Promise.all(tareasCompletadasIds.map((id) => deleteTask(id)));
    fetchTasks();
  });

  allFilter.addEventListener("click", () => {
    renderTaskList();
  });

  activeFilter.addEventListener("click", () => {
    renderTaskList(false);
  });

  completedFilter.addEventListener("click", () => {
    renderTaskList(true);
  });

  fetchTasks();
});
