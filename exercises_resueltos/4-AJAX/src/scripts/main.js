document.addEventListener("DOMContentLoaded", () => {
  const formAdd = document.querySelector("#formulario-tarea");
  const lista = document.querySelector("#lista-tareas");

  function crearElementoTarea({ id, description, status }) {
    const li = document.createElement("li");
    li.className = "tarea flex items-center py-3 border-b border-[#e0e0e0] gap-2 justify-center";
    li.innerHTML = `
      <form action="/api/update-task" method="post" class="inline">
        <input type="hidden" name="id" value="${id}" />
        <input type="hidden" name="status" value="${status === 'complete' ? 'incomplete' : 'complete'}" />
        <input type="checkbox" ${status === 'complete' ? 'checked' : ''} class="scale-125 cursor-pointer mr-2" />
      </form>
      <label class="flex-1 text-base text-left ${status === 'complete' ? 'line-through text-gray-400' : ''}">
        ${description}
      </label>
      <form action="/api/delete-task" method="post" class="inline">
        <input type="hidden" name="id" value="${id}" />
        <button type="submit" class="delete-task bg-none border-none text-red-600 text-xl cursor-pointer hover:text-red-700">🗑</button>
      </form>
    `;
    activarEventosDeTarea(li); // importante para que funcione al renderizar por JS
    return li;
  }

  async function activarEventosDeTarea(li) {
    // Checkbox actualizar estado
    const updateForm = li.querySelector('form[action="/api/update-task"]');
    const checkbox = updateForm.querySelector('input[type="checkbox"]');

    checkbox.addEventListener("change", async (e) => {
      e.preventDefault();
      const formData = new FormData(updateForm);
      const id = formData.get("id");
      const status = formData.get("status");

      const res = await fetch("/api/update-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        const newStatus = status === "complete" ? "incomplete" : "complete";
        updateForm.querySelector('input[name="status"]').value = newStatus;
        const label = li.querySelector("label");
        label.classList.toggle("line-through");
        label.classList.toggle("text-gray-400");
      }
    });

    // Botón eliminar tarea
    const deleteForm = li.querySelector('form[action="/api/delete-task"]');
    deleteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = new FormData(deleteForm).get("id");

      const res = await fetch("/api/delete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        li.remove();
      }
    });
  }

  // Agregar tarea
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
        const nuevaLi = crearElementoTarea(nuevaTarea);
        lista.appendChild(nuevaLi);
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
        document.querySelectorAll("#lista-tareas li").forEach(li => {
          const label = li.querySelector("label");
          if (label.classList.contains("line-through")) {
            li.remove();
          }
        });
      }
    });
  }

  // Filtros dinámicos sin recarga
  const filtros = document.querySelectorAll(".filters a");
  filtros.forEach((filtro) => {
    filtro.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = new URL(filtro.href);
      const status = url.searchParams.get("status");

      const res = await fetch(`/api/filter-tasks?status=${status}`);
      if (!res.ok) return;

      const tareas = await res.json();
      lista.innerHTML = "";
      tareas.forEach((task) => {
        const li = crearElementoTarea(task);
        lista.appendChild(li);
      });

      // Estilos del filtro activo
      filtros.forEach((f) => f.classList.remove("bg-green-500", "text-white", "border-green-500"));
      filtro.classList.add("bg-green-500", "text-white", "border-green-500");
    });
  });

  // Activar eventos para tareas ya renderizadas en SSR
  document.querySelectorAll("#lista-tareas li").forEach(activarEventosDeTarea);
});