document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  type Task = {
    id: number;
    text: string;
    completed: boolean;
  };

  const taskList = document.querySelector("#task-list") as HTMLElement;
  let tasks: Task[] = [];

  function renderTasks(): void {
    console.log("Rendering tasks:", tasks);
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      if (!task) return;

      const li = document.createElement("li");
      li.className = "flex items-center justify-between p-3 border-b border-gray-300";
      li.setAttribute("data-id", task.id.toString());

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.className = "mr-3 w-5 h-5 accent-orange-500 cursor-pointer";

      const taskSpan = document.createElement("span");
      taskSpan.textContent = task.text;
      taskSpan.className = `flex-1 text-left ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑";
      deleteButton.className = "ml-3 text-red-500 hover:text-red-700 cursor-pointer delete-task";

      li.appendChild(checkbox);
      li.appendChild(taskSpan);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }

  taskList.addEventListener("change", async (event) => {
    const target = event.target as HTMLInputElement;

    if (target.matches("input[type='checkbox']")) {
      const li = target.closest("li");
      const id = li?.getAttribute("data-id");

      if (id) {
        const res = await fetch("/api/toggle_task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Number(id) }),
        });

        if (res.ok) {
          const data = await res.json();
          tasks = data.tasks;
          renderTasks();
        } else {
          console.error("Error toggling task");
        }
      }
    }
  });

  taskList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    if (target.matches("button.delete-task")) {
      const li = target.closest("li");
      const id = li?.getAttribute("data-id");

      if (id) {
        const res = await fetch("/api/delete_task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Number(id) }),
        });

        if (res.ok) {
          const data = await res.json();
          tasks = data.tasks;
          renderTasks();
        } else {
          console.error("Error deleting task");
        }
      }
    }
  });

  const addTaskForm = document.getElementById("addTaskForm") as HTMLFormElement;
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();

      const formData = new FormData(addTaskForm);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch(addTaskForm.action, {
        method: addTaskForm.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { task }: { success: true; task: Task } = await res.json();
        tasks.push(task);
        renderTasks();
        addTaskForm.reset();
      } else {
        console.error("Error adding task", res.status);
      }
    });
  }

  const clearCompletedForm = document.getElementById("clearCompletedForm") as HTMLFormElement;
  if (clearCompletedForm) {
    clearCompletedForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const res = await fetch(clearCompletedForm.action, {
        method: "POST",
      });

      if (res.ok) {
        const responseData = await res.json();
        tasks = responseData.tasks;
        renderTasks();
      } else {
        console.error("Error clearing completed tasks");
      }
    });
  }

  const filterButtons = document.querySelectorAll('button[name="filter"]');
  filterButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent full page reload

      const filter = button.getAttribute("value");
      if (!filter) return;

      // 🔁 Update the browser URL without reloading the page
      history.replaceState(null, "", `?filter=${filter}`);

      const res = await fetch(`/api/filter_tasks?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        tasks = data.tasks;
        renderTasks();
      } else {
        console.error("Error filtering tasks");
      }
    });
  });

  async function fetchTasks() {
    const res = await fetch("/api/get_tasks");
    if (res.ok) {
      const { tasks: fetchedTasks } = await res.json();
      tasks = fetchedTasks;
      renderTasks();
    } else {
      console.error("Error fetching tasks");
    }
  }

  fetchTasks();
});
