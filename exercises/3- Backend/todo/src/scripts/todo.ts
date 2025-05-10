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
      const response = await fetch("http://localhost:3000/api/task");
      tasks = await response.json();
      renderTaskList();
    }
  
    async function addTask(text: string) {
      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const newTask = await response.json();
      tasks.push(newTask);
      renderTaskList();
    }
  
    async function updateTask(id: number, completed: boolean) {
      await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      );
      renderTaskList();
    }
  
    async function deleteTask(id: number) {
      await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "DELETE",
      });
      tasks = tasks.filter((task) => task.id !== id);
      renderTaskList();
    }
  
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
  
    taskForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const taskText = taskInput.value.trim();
      if (taskText) {
        await addTask(taskText);
        taskInput.value = "";
      }
    });
  
    clearFilter.addEventListener("click", () => {
      tasks.forEach((task) => {
        if (task.completed) {
          deleteTask(task.id);
        }
      });
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
  