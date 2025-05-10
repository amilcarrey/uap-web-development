const form = document.getElementById("form-tarea");
const input = document.getElementById("input-tarea");
const lista = document.getElementById("lista-tareas");

async function cargarTareas() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const filtro = urlParams.get("filtro") || "todos";

    const response = await fetch(`/api/tareas?filtro=${filtro}`);
    const data = await response.json();

    if (response.ok) {
      renderizarTareas(data.tareas);
    } else {
      console.error("Error al cargar tareas:", data.message);
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

function renderizarTareas(tareas) {
  lista.innerHTML = "";

  tareas.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="toggle-tarea" data-index="${index}">
        ${task.completada ? "✅" : "⬜️"}
      </button>
      ${task.completada ? `<s>${task.nombre}</s>` : task.nombre}
      <button class="eliminar-tarea" data-index="${index}">🗑️</button>
    `;
    lista.appendChild(li);
  });

  document.querySelectorAll(".toggle-tarea").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const index = e.target.dataset.index;
      await toggleTarea(index);
    });
  });

  document.querySelectorAll(".eliminar-tarea").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const index = e.target.dataset.index;
      await eliminarTarea(index);
    });
  });
}

async function toggleTarea(index) {
  try {
    const res = await fetch(`/api/tareas/${index}/toggle`, {
      method: "POST",
    });

    if (res.ok) {
      cargarTareas();
    } else {
      const error = await res.json();
      alert(`Error al alternar tarea: ${error.message}`);
    }
  } catch (error) {
    alert("Error al alternar tarea.");
    console.error(error);
  }
}

async function eliminarTarea(index) {
  try {
    const res = await fetch(`/api/tareas/${index}`, {
      method: "POST",
    });

    if (res.ok) {
      cargarTareas();
    } else {
      const error = await res.json();
      alert(`Error al eliminar tarea: ${error.message}`);
    }
  } catch (error) {
    alert("Error al eliminar tarea.");
    console.error(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  try {
    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: texto }),
    });

    if (res.ok) {
      cargarTareas();
      input.value = "";
    } else {
      const error = await res.json();
      alert(`Error al crear la tarea: ${error.message}`);
    }
  } catch (error) {
    alert("Error al crear la tarea.");
    console.error(error);
  }
});

document
  .getElementById("form-eliminar-completadas")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/tareas/completadas", {
        method: "DELETE",
      });

      if (res.ok) {
        cargarTareas();
      } else {
        const error = await res.json();
        alert(`Error al eliminar tareas completadas: ${error.message}`);
      }
    } catch (error) {
      alert("Error al eliminar tareas completadas.");
      console.error(error);
    }
  });

document.addEventListener("DOMContentLoaded", cargarTareas);
