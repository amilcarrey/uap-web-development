document.addEventListener("DOMContentLoaded", () => {
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
        location.reload(); // O mejor: agregar directamente al DOM
      }
    });
  }

  // Actualizar estado de tarea (completa/incompleta)
  const updateForms = document.querySelectorAll('form[action="/api/update-task"]');
  updateForms.forEach(form => {
    const checkbox = form.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", async (e) => {
      e.preventDefault();
      const id = form.querySelector('input[name="id"]').value;
      const status = checkbox.checked ? "complete" : "incomplete";

      const res = await fetch("/api/update-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        // Actualizar la clase visual sin recargar
        const label = form.parentElement.querySelector("label");
        label.classList.toggle("line-through", checkbox.checked);
        label.classList.toggle("text-gray-400", checkbox.checked);
      }
    });
  });

  // Eliminar tarea
  const deleteForms = document.querySelectorAll('form[action="/api/delete-task"]');
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

  // Limpiar tareas completadas
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