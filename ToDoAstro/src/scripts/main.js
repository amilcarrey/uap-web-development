const tareasContainer = document.getElementById("tareas-container");
const filtrosForm = document.getElementById("filtros-form");

let filtroActual = "todas";

// Función para cargar y renderizar tareas
async function cargarTareas() {
  const res = await fetch("/api/listar");
  const tareas = await res.json();

  let tareasFiltradas = tareas;
  if (filtroActual === "completadas") {
    tareasFiltradas = tareas.filter(t => t.completada);
  } else if (filtroActual === "incompletas") {
    tareasFiltradas = tareas.filter(t => !t.completada);
  }

  tareasContainer.innerHTML = "";

  tareasFiltradas.forEach(tarea => {
    const div = document.createElement("div");
    div.className = "flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg";
    div.innerHTML = `
      <button data-toggle="${tarea.id}" class="bg-pink-300 text-white px-3 py-1 rounded-full text-lg font-bold">
        ${tarea.completada ? "✓" : "○"}
      </button>
      <div class="flex-1 mx-3 text-base text-left ${tarea.completada ? 'line-through text-gray-400' : ''}">
        ${tarea.texto}
      </div>
      <button data-eliminar="${tarea.id}" class="bg-pink-300 text-white px-3 py-1 rounded-full text-lg font-bold">✕</button>
    `;
    tareasContainer.appendChild(div);
  });
}

// Filtrar tareas
filtrosForm?.addEventListener("click", (e) => {
  const boton = e.target.closest("a[data-filtro]");
  if (!boton) return;

  e.preventDefault();

  filtroActual = boton.dataset.filtro;

  document.querySelectorAll("#filtros-form a").forEach(btn => {
    btn.classList.remove("bg-green-300", "text-white");
    btn.classList.add("bg-gray-100");
  });

  boton.classList.add("bg-green-300", "text-white");
  boton.classList.remove("bg-gray-100");

  cargarTareas();
});

// Agregar tarea
document.querySelector('form[action="/api/agregar"]')?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  await fetch("/api/agregar", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json" // para evitar redirect
    }
  });

  form.reset();
  await cargarTareas();
});

// Eliminar o completar tarea
tareasContainer?.addEventListener("click", async (e) => {
  const eliminarBtn = e.target.closest("button[data-eliminar]");
  const toggleBtn = e.target.closest("button[data-toggle]");

  if (eliminarBtn) {
    const id = eliminarBtn.dataset.eliminar;
    const formData = new FormData();
    formData.append("id", id);

    await fetch("/api/eliminar", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json" // evita el error
      }
    });

    await cargarTareas();
  }

  if (toggleBtn) {
    const id = toggleBtn.dataset.toggle;

    await fetch(`/api/toggle/${id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json" // evita redirect innecesario
      }
    });

    await cargarTareas();
  }
});

// Limpiar tareas completadas
document.querySelector('form[action="/api/limpiar"]')?.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/limpiar", {
    method: "POST",
    headers: {
      "Accept": "application/json" // buena práctica
    }
  });

  await cargarTareas();
});

cargarTareas();