document.addEventListener("DOMContentLoaded", () => {
  const listaTareas = document.querySelector("#lista-tareas");

  // Función para crear un elemento de tarea en el DOM
  function crearElementoTarea(task) {
    const li = document.createElement("li");
    li.className = "tarea flex items-center py-3 border-b border-[#e0e0e0] gap-2 justify-center";
    li.dataset.id = task.id;

    // Formulario de actualización de estado
    const formUpdate = document.createElement("form");
    formUpdate.action = "/api/update-task";
    formUpdate.method = "post";
    formUpdate.className = "inline";

    const inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.name = "id";
    inputId.value = task.id;

    const inputStatus = document.createElement("input");
    inputStatus.type = "hidden";
    inputStatus.name = "status";
    inputStatus.value = task.status === "complete" ? "incomplete" : "complete";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.status === "complete";
    checkbox.className = "scale-125 cursor-pointer mr-2";
    checkbox.addEventListener("change", async () => {
      inputStatus.value = checkbox.checked ? "complete" : "incomplete";
      const res = await fetch("/api/update-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: inputStatus.value }),
      });

      if (res.ok) {
        label.classList.toggle("line-through", checkbox.checked);
        label.classList.toggle("text-gray-400", checkbox.checked);
      }
    });

    formUpdate.appendChild(inputId);
    formUpdate.appendChild(inputStatus);
    formUpdate.appendChild(checkbox);

    const label = document.createElement("label");
    label.className = `flex-1 text-base text-left ${task.status === 'complete' ? 'line-through text-gray-400' : ''}`;
    label.textContent = task.description;

    // Formulario de eliminación
    const formDelete = document.createElement("form");
    formDelete.action = "/api/delete-task";
    formDelete.method = "post";
    formDelete.className = "inline";

    const inputDeleteId = document.createElement("input");
    inputDeleteId.type = "hidden";
    inputDeleteId.name = "id";
    inputDeleteId.value = task.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "submit";
    deleteButton.className = "delete-task bg-none border-none text-red-600 text-xl cursor-pointer hover:text-red-700";
    deleteButton.textContent = "🗑";

    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/delete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id }),
      });

      if (res.ok) {
        li.remove();
      }
    });

    formDelete.appendChild(inputDeleteId);
    formDelete.appendChild(deleteButton);

    li.appendChild(formUpdate);
    li.appendChild(label);
    li.appendChild(formDelete);

    return li;
  }

  // Agregar tarea
  const formAdd = document.querySelector("#formulario-tarea");
  if (formAdd) {
    formAdd.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formAdd);
      const description = formData.get("description");

      const res = await fetch("/api/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        const nuevaTarea = await res.json();
        const elemento = crearElementoTarea(nuevaTarea);
        listaTareas.appendChild(elemento);
        formAdd.reset();
      }
    });
  }

  // Limpiar tareas completadas
  const clearForm = document.querySelector('form[action="/api/clear-completed"]');
  if (clearForm) {
    clearForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/clear-completed", { method: "POST" });
      if (res.ok) {
        document.querySelectorAll(".tarea").forEach((tarea) => {
          const checkbox = tarea.querySelector("input[type=checkbox]");
          if (checkbox?.checked) tarea.remove();
        });
      }
    });
  }
});