console.log("✅ script.ts cargado");

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-tareas") as HTMLUListElement;
  const form = document.getElementById(
    "form-agregar"
  ) as HTMLFormElement | null;
  const input = document.getElementById(
    "input-tarea"
  ) as HTMLInputElement | null;
  const template = document.getElementById(
    "tarea-template"
  ) as HTMLTemplateElement;
  const btnLimpiar = document.getElementById("btn-limpiar");
  const filtros = document.querySelectorAll(".filtro");
  const url = new URL(window.location.href);
  let filtroActual = url.searchParams.get("filtro") || "todas";

  if (!form || !input || !lista || !template) {
    console.error("❌ Elementos no encontrados");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const texto = input.value.trim();
    if (!texto) return;

    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "agregar", texto }),
    });

    const data = await res.json();
    input.value = "";
    renderTarea(data.tarea);
  });

  btnLimpiar?.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "limpiar" }),
    });

    lista.querySelectorAll("li").forEach((li) => {
      const btn = li.querySelector("[data-toggle]");
      if (btn?.textContent === "✔️") li.remove();
    });
  });

  

filtros.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const filtro = btn.getAttribute("href")?.split("filtro=")[1] || "todas";

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("filtro", filtro);
    history.pushState(null, "", newUrl.toString());

    filtroActual = filtro;

    const res = await fetch(`/api/tareas-data?filtro=${filtroActual}`);
    const tareas = await res.json();

    lista.innerHTML = "";
    tareas.forEach(renderTarea);
  });
});


  async function cargarTareas() {
    const res = await fetch(`/api/tareas-data?filtro=${filtroActual}`);
    const tareas = await res.json();

    lista.innerHTML = "";
    tareas.forEach(renderTarea);
  }

  function renderTarea(tarea: any) {
    const clone = template.content.cloneNode(true) as HTMLElement;
    const li = clone.querySelector("li")!;
    const btnToggle = li.querySelector("[data-toggle]") as HTMLButtonElement;
    const span = li.querySelector("span")!;
    const btnBorrar = li.querySelector("[data-borrar]") as HTMLButtonElement;
  
    // Texto
    span.textContent = tarea.texto;
  
    // Estado completado
    btnToggle.textContent = tarea.completada ? "✔️" : "";
    if (tarea.completada) {
      btnToggle.classList.add("bg-green-100", "text-green-700", "border-green-500");
      span.classList.add("line-through", "text-gray-400");
    }
  
    // Acciones
    btnToggle.addEventListener("click", async () => {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "toggle", id: tarea.id }),
      });
      const updated = await res.json();
      tarea.completada = updated.completada;
      cargarTareas();
    });
  
    btnBorrar.addEventListener("click", async () => {
      await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "borrar", id: tarea.id }),
      });
      li.remove();
    });
  
    lista.appendChild(clone);
  }
  

  cargarTareas();
});
