document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const addTaskForm = document.getElementById("add-task-form");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");
    const filterButtons = document.querySelectorAll(".filter-btn");
  
    // Función para actualizar la lista de tareas a partir del HTML que devuelve el servidor
    function updateTaskList(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      taskList.innerHTML = doc.getElementById("taskList").innerHTML;
    }
  
    // Agregar tarea mediante AJAX
    addTaskForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const description = document.getElementById("taskDescription").value;
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", description }),
      });
      if (response.ok) {
        const html = await response.text();
        updateTaskList(html);
        addTaskForm.reset();
      }
    });
  
    // Delegar eventos de toggle y delete en la lista
    taskList.addEventListener("click", async (event) => {
      const target = event.target;
      const li = target.closest("li");
      if (!li) return;
      const taskId = li.dataset.id;
      if (target.classList.contains("toggle-task-btn")) {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggle", id: taskId }),
        });
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      }
      if (target.classList.contains("delete-task-btn")) {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete", id: taskId }),
        });
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      }
    });
  
    // Filtrar tareas mediante AJAX
    filterButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const filter = button.dataset.filter;
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filter }),
        });
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      });
    });
  
    // Limpiar tareas completadas mediante AJAX
    clearCompletedBtn.addEventListener("click", async () => {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clearCompleted" }),
      });
      if (response.ok) {
        const html = await response.text();
        updateTaskList(html);
      }
    });
  });