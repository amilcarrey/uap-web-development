document.addEventListener("DOMContentLoaded", () => {
  const inputTarea = document.getElementById("añadir");
  const botonAñadir = document.getElementById("añadir-boton");
  const formularioTareas = document.getElementById("formulario-tareas");
  const botonEliminarCompletadas = document.getElementById("clear");

  const filtroTodas = document.getElementById("filtro-todas");
  const filtroIncompletas = document.getElementById("filtro-incompletas");
  const filtroCompletas = document.getElementById("filtro-completas");

  let tareas = [];

  const tabs = document.querySelectorAll(".tab");

  function agregarTarea() {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea === "") {
      alert("Por favor, ingresa una tarea válida.");
      return;
    }

    const contenedorTarea = document.createElement("div");
    contenedorTarea.classList.add("contenedor-tarea");

    const infoTarea = document.createElement("div");
    infoTarea.classList.add("info-tarea");

    const labelTarea = document.createElement("label");
    labelTarea.classList.add("tarea");
    labelTarea.textContent = textoTarea;

    const botonFinalizar = document.createElement("button");
    botonFinalizar.classList.add("finalizar-tarea");
    botonFinalizar.textContent = "⭕"; 
    botonFinalizar.addEventListener("click", (event) => {
      event.preventDefault(); // Evita que se recargue la página
      labelTarea.classList.toggle("completada");
      botonFinalizar.textContent = labelTarea.classList.contains("completada")
        ? "✅"
        : "⭕";
      tarea.completada = labelTarea.classList.contains("completada");
      // Aplicar el filtro después de marcar la tarea como completada
      aplicarFiltro(
        document.querySelector(".tab.active").id.replace("filtro-", "")
      );
    });

    const botonBorrar = document.createElement("button");
    botonBorrar.classList.add("borrar-tarea");
    botonBorrar.textContent = "🗑️";
    botonBorrar.addEventListener("click", () => {
      contenedorTarea.remove();
      tareas = tareas.filter((t) => t.elemento !== contenedorTarea);
    });


    infoTarea.appendChild(botonFinalizar);
    infoTarea.appendChild(labelTarea);
    contenedorTarea.appendChild(infoTarea);
    contenedorTarea.appendChild(botonBorrar);

    const tarea = {
      texto: textoTarea,
      elemento: contenedorTarea,
      completada: false,
    };
    tareas.push(tarea);

    const filtroActivo = document.querySelector(".tab.active").id;
    if (
      filtroActivo === "filtro-todas" ||
      filtroActivo === "filtro-incompletas"
    ) {
      formularioTareas.insertBefore(
        contenedorTarea,
        formularioTareas.lastElementChild
      );
    }

    inputTarea.value = "";
  }

  botonAñadir.addEventListener("click", agregarTarea);

  inputTarea.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      agregarTarea();
    }
  });

  botonEliminarCompletadas.addEventListener("click", () => {
    const tareasCompletadas = document.querySelectorAll(".completada");
    tareasCompletadas.forEach((tarea) => {
      tarea.closest(".contenedor-tarea").remove();
      // Eliminar tarea del arreglo
      tareas = tareas.filter(
        (t) => t.elemento !== tarea.closest(".contenedor-tarea")
      );
    });
  });

  function aplicarFiltro(filtro) {
    // Cambiar la clase activa en los botones
    tabs.forEach((tab) => tab.classList.remove("active"));
    switch (filtro) {
      case "todas":
        filtroTodas.classList.add("active");
        break;
      case "incompletas":
        filtroIncompletas.classList.add("active");
        break;
      case "completas":
        filtroCompletas.classList.add("active");
        break;
    }

    document
      .querySelector(".tabs")
      .style.setProperty("--tab-offset", `${offset}px`);

    tareas.forEach((tarea) => {
      const contenedor = tarea.elemento;
      switch (filtro) {
        case "todas":
          contenedor.style.display = "flex";
          break;
        case "incompletas":
          contenedor.style.display = tarea.completada ? "none" : "flex";
          break;
        case "completas":
          contenedor.style.display = tarea.completada ? "flex" : "none";
          break;
      }
    });
  }

  function eliminarTareasCompletadas() {
    console.log("Eliminando tareas completadas");

    const contenedoresTareas = document.querySelectorAll(".contenedor-tarea");

    contenedoresTareas.forEach((contenedor) => {
      // Si el label de la tarea tiene la clase 'completada', eliminamos el contenedor
      const labelTarea = contenedor.querySelector(".tarea");
      if (labelTarea && labelTarea.classList.contains("completada")) {
        contenedor.remove(); // Elimina el contenedor de la tarea
        // Eliminar tarea del arreglo
        tareas = tareas.filter((tarea) => tarea.elemento !== contenedor);
      }
    });
  }

  botonEliminarCompletadas.addEventListener("click", eliminarTareasCompletadas);

  // Añadir los eventos de los botones de filtro
  filtroTodas.addEventListener("click", () => aplicarFiltro("todas"));
  filtroIncompletas.addEventListener("click", () =>
    aplicarFiltro("incompletas")
  );
  filtroCompletas.addEventListener("click", () => aplicarFiltro("completas"));

  aplicarFiltro("todas");
});

document.head.insertAdjacentHTML(
  "beforeend",
  "<style>.completada { text-decoration: line-through; color: gray; }</style>"
);
