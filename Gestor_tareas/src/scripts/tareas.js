document.addEventListener("DOMContentLoaded", () => {
  const lista = document.querySelector(".listaTareas");

  // Agregar nueva tarea sin recargar
  document.querySelector(".form1")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const body = Object.fromEntries(data.entries());

    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const nuevaTarea = {
        texto: body.texto,
        id: crypto.randomUUID(),
        completada: false,
      };

      const li = crearElementoTarea(nuevaTarea);
      lista.appendChild(li);
      form.reset();
    }
  });

  // Delegación: eliminar o toggle
  lista?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const accion = data.get("accion");
    const id = data.get("id");

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });

    const li = form.closest("li");

    if (accion === "eliminar") {
      li.classList.add("opacity-0", "translate-x-4");
      setTimeout(() => li.remove(), 300);
    } else if (accion === "toggle") {
      const span = li?.querySelector(".tarea-texto");
      const btn = form.querySelector("button");
      const completada = btn.textContent === "✅";
      btn.textContent = completada ? "⬜" : "✅";
      span.classList.toggle("line-through", !completada);
      span.classList.toggle("text-gray-400", !completada);
    }
  });

  // Limpiar completadas / eliminar todas
  document.querySelectorAll(".botones-borrar form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const accion = data.get("accion");

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });

      if (accion === "limpiar") {
        document.querySelectorAll(".listaTareas li").forEach((li) => {
          if (li.querySelector("button")?.textContent === "✅") {
            li.classList.add("opacity-0", "translate-x-4");
            setTimeout(() => li.remove(), 300);
          }
        });
      } else if (accion === "eliminarTodas") {
        lista.querySelectorAll("li").forEach((li) => {
          li.classList.add("opacity-0", "translate-x-4");
          setTimeout(() => li.remove(), 300);
        });
      }
    });
  });

  // Crear tarea HTML con animación
  function crearElementoTarea(tarea) {
    const li = document.createElement("li");
    li.className =
      "contenido transition-all duration-300 ease-in-out opacity-0 translate-y-2";

    requestAnimationFrame(() => {
      li.classList.remove("opacity-0", "translate-y-2");
      li.classList.add("opacity-100", "translate-y-0");
    });

    const formToggle = document.createElement("form");
    formToggle.method = "POST";
    formToggle.innerHTML = `
      <input type="hidden" name="accion" value="toggle" />
      <input type="hidden" name="id" value="${tarea.id}" />
      <button class="casilla" type="submit" title="Marcar como completada">
        ⬜
      </button>`;

    const span = document.createElement("span");
    span.className = "tarea-texto transition-colors duration-300";
    span.textContent = tarea.texto;

    const formEliminar = document.createElement("form");
    formEliminar.method = "POST";
    formEliminar.innerHTML = `
      <input type="hidden" name="accion" value="eliminar" />
      <input type="hidden" name="id" value="${tarea.id}" />
      <button class="btn-eliminar" type="submit">X</button>`;

    li.appendChild(formToggle);
    li.appendChild(span);
    li.appendChild(formEliminar);

    return li;
  }
});
