document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const response = await fetch("/add-task", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("Error al agregar tarea");
            return;
        }


        const tasks = await response.json(); // ahora es un array de tareas

        renderTasks(tasks);
        attachTaskEventListeners();
        form.reset();
    });

    function renderTasks(tasks) {
        const list = document.querySelector("#task-list");
        list.innerHTML = "";

        for (const task of tasks) {
            const li = document.createElement("li");
            li.className =
                "bg-gray-100 mb-2 p-5 rounded-lg flex items-center justify-between";

            li.innerHTML = `
          <form method="POST" class="inline" action-toggle>
            <input type="hidden" name="id" value="${task.id}" />
            <button
              type="submit"
              name="action"
              value="toggle"
              class="text-xl cursor-pointer transition-transform transform hover:scale-110"
            >
              ${task.completed ? "✅" : "⬜"}
            </button>
          </form>
  
          <span class="${task.completed ? "line-through text-gray-500" : ""}">
            ${task.task_content}
          </span>
  
          <form method="POST" class="inline" action-delete>
            <input type="hidden" name="id" value="${task.id}" />
            <button
              type="submit"
              name="action"
              value="delete"
              class="text-xl text-red-500 hover:text-red-700 transition-colors"
            >
              🗑
            </button>
          </form>
        `;

            list.appendChild(li);
        }
    }

    function attachTaskEventListeners() {
        const toggleForms = document.querySelectorAll("form[action-toggle]");
        const deleteForms = document.querySelectorAll("form[action-delete]");

        toggleForms.forEach((form) => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                formData.set("action", "toggle");

                const response = await fetch("/update-task", {
                    method: "POST",
                    body: formData,
                });

                const tasks = await response.json();
                renderTasks(tasks);
                attachTaskEventListeners(); // Reasignar eventos
            });
        });

        deleteForms.forEach((form) => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                formData.set("action", "delete");

                const response = await fetch("/update-task", {
                    method: "POST",
                    body: formData,
                });

                const tasks = await response.json();
                renderTasks(tasks);
                attachTaskEventListeners(); // Reasignar eventos
            });
        });
    }

});
