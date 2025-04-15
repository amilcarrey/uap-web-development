document.addEventListener("DOMContentLoaded", () => {
  const formAdd = document.querySelector("#formulario-tarea");
  const listaTareas = document.querySelector("#lista-tareas");

  if (formAdd && listaTareas) {
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
        const newTask = await res.json(); // Esperamos que devuelva { id, description, status }

        // Crear nuevo <li>
        const li = document.createElement("li");
        li.className = "tarea flex items-center py-3 border-b border-[#e0e0e0] gap-2 justify-center";

        li.innerHTML = `
          <form action="/api/update-task" method="post" class="inline">
            <input type="hidden" name="id" value="${newTask.id}" />
            <input type="hidden" name="status" value="complete" />
            <input type="checkbox" class="scale-125 cursor-pointer mr-2" />
          </form>
          <label class="flex-1 text-base text-left">${newTask.description}</label>
          <form action="/api/delete-task" method="post" class="inline">
            <input type="hidden" name="id" value="${newTask.id}" />
            <button type="submit" class="delete-task bg-none border-none text-red-600 text-xl cursor-pointer hover:text-red-700">🗑</button>
          </form>
        `;

        // Insertar en la lista
        listaTareas.appendChild(li);

        // Reasignar eventos para el checkbox y el botón eliminar
        asignarEventos(li);

        // Limpiar el input
        formAdd.reset();
      }
    });
  }

  // Función para manejar tareas existentes
  function asignarEventos(scope = document) {
    // Checkbox actualizar estado
    const updateForms = scope.querySelectorAll('form[action="/api/update-task"]');
    updateForms.forEach(form => {
      const checkbox = form.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      checkbox.addEventListener("change", async () => {
        const id = form.querySelector('input[name="id"]').value;
        const status = checkbox.checked ? "complete" : "incomplete";

        const res = await fetch("/api/update-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });

        if (res.ok) {
          const label = form.parentElement.querySelector("label");
          label.classList.toggle("line-through", checkbox.checked);
          label.classList.toggle("text-gray-400", checkbox.checked);
        }
      });
    });

    // Botón eliminar
    const deleteForms = scope.querySelectorAll('form[action="/api/delete-task"]');
    deleteForms.forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.querySelector('input[name="id"]').value;

        const res = await fetch("/api/delete-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          form.closest("li").remove();
        }
      });
    });
  }

  // Aplicar eventos a tareas ya cargadas
  asignarEventos();

  // Limpiar completadas
  const clearForm = document.querySelector('form[action="/api/clear-completed"]');
  if (clearForm) {
    clearForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/clear-completed", { method: "POST" });
      if (res.ok) {
        document.querySelectorAll("#lista-tareas li").forEach(li => {
          const label = li.querySelector("label");
          if (label.classList.contains("line-through")) {
            li.remove();
          }
        });
      }
    });
  }
});