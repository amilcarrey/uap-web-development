console.log("✅ script.ts cargado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOMContentLoaded");
  const lista = document.getElementById("lista-tareas") as HTMLUListElement | null;
  console.log("🔍 lista-tareas:", lista);

  const form = document.getElementById("form-agregar") as HTMLFormElement | null;
  const input = document.getElementById("input-tarea") as HTMLInputElement | null;
  
  const template = document.getElementById("tarea-template") as HTMLTemplateElement | null;
  const btnLimpiar = document.getElementById("btn-limpiar");
  let filtroActual: "todas" | "completas" | "incompletas" = "todas";


  if (!form || !input || !lista || !template) {
    console.error("❌ Elementos del DOM no encontrados");
    return;
  }  



  console.log("🧠 Formulario encontrado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🚫 Recarga PREVENIDA");

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

  btnLimpiar?.addEventListener("click", async () => {
    await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "limpiar" }),
    });
  
    // Eliminar del DOM las tareas marcadas como completadas
    lista.querySelectorAll("li").forEach((li) => {
      const toggle = li.querySelector("[data-toggle]");
      if (toggle?.textContent === "✔️") {
        li.remove();
      }
    });
  });
  

  document.querySelectorAll(".filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroActual = btn.getAttribute("data-filtro") as typeof filtroActual;
      cargarTareas();
    });
  });

  async function cargarTareas() {
    const res = await fetch("/api/tareas-data");
    const tareas = await res.json();
    
    lista.innerHTML = "";
    tareas
      .filter((t: any) =>
        filtroActual === "completas"
          ? t.completada
          : filtroActual === "incompletas"
          ? !t.completada
          : true
      )
      .forEach(renderTarea);
  }

  function renderTarea(tarea: any) {
    const clone = template.content.cloneNode(true) as HTMLElement;
    const li = clone.querySelector("li")!;
    const btnToggle = clone.querySelector("[data-toggle]") as HTMLButtonElement;
    const span = clone.querySelector("span")!;
    const btnBorrar = clone.querySelector("[data-borrar]") as HTMLButtonElement;

    btnToggle.textContent = tarea.completada ? "✔️" : "";
    span.textContent = tarea.texto;

    if (tarea.completada) {
      btnToggle.classList.add("bg-green-100", "text-green-700", "border-green-500");
      span.classList.add("line-through", "text-gray-400");
    }

    btnToggle.addEventListener("click", async () => {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "toggle", id: tarea.id }),
      });
    
      const updated = await res.json();
    
      // Actualizar solo la tarea actual
      tarea.completada = updated.completada;
    
      btnToggle.textContent = tarea.completada ? "✔️" : "";
      btnToggle.classList.toggle("bg-green-100", tarea.completada);
      btnToggle.classList.toggle("text-green-700", tarea.completada);
      btnToggle.classList.toggle("border-green-500", tarea.completada);
      span.classList.toggle("line-through", tarea.completada);
      span.classList.toggle("text-gray-400", tarea.completada);
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
