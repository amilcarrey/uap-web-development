document.addEventListener("DOMContentLoaded", () => {
  const inputTarea = document.getElementById("añadir");
  const botonAñadir = document.getElementById("añadir-boton");
  const formularioTareas = document.getElementById("formulario-tareas");
  const botonEliminarCompletadas = document.getElementById("clear");

  // Botones de filtro
  const filtroTodas = document.getElementById("filtro-todas");
  const filtroIncompletas = document.getElementById("filtro-incompletas");
  const filtroCompletas = document.getElementById("filtro-completas");

  // Variable para almacenar todas las tareas
  let tareas = [];

  const tabs = document.querySelectorAll(".tab");

  // Función para agregar tarea
  function agregarTarea() {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea === "") {
      alert("Por favor, ingresa una tarea válida.");
      return;
    }

    // Crear contenedor de tarea
    const contenedorTarea = document.createElement("div");
    contenedorTarea.classList.add("contenedor-tarea");

    // Crear div para la información de la tarea
    const infoTarea = document.createElement("div");
    infoTarea.classList.add("info-tarea");

    // Label de la tarea
    const labelTarea = document.createElement("label");
    labelTarea.classList.add("tarea");
    labelTarea.textContent = textoTarea;

    // Botón de completar/descompletar tarea
    const botonFinalizar = document.createElement("button");
    botonFinalizar.classList.add("finalizar-tarea");
    botonFinalizar.textContent = "⭕"; // Representa tarea no completada
    botonFinalizar.addEventListener("click", (event) => {
      event.preventDefault(); // Evita que se recargue la página
      // Solo marcar como completada (tachar el texto)
      labelTarea.classList.toggle("completada");
      // Cambiar el ícono de círculo a checkmark
      botonFinalizar.textContent = labelTarea.classList.contains("completada")
        ? "✅"
        : "⭕";
      // Actualizar el estado de la tarea en el arreglo
      tarea.completada = labelTarea.classList.contains("completada");
      // Aplicar el filtro después de marcar la tarea como completada
      aplicarFiltro(
        document.querySelector(".tab.active").id.replace("filtro-", "")
      );
    });

    // Botón de borrar tarea
    const botonBorrar = document.createElement("button");
    botonBorrar.classList.add("borrar-tarea");
    botonBorrar.textContent = "🗑️";
    botonBorrar.addEventListener("click", () => {
      contenedorTarea.remove();
      // Eliminar tarea del arreglo
      tareas = tareas.filter((t) => t.elemento !== contenedorTarea);
    });

    // Agregar elementos al contenedor de tarea
    infoTarea.appendChild(botonFinalizar);
    infoTarea.appendChild(labelTarea);
    contenedorTarea.appendChild(infoTarea);
    contenedorTarea.appendChild(botonBorrar);

    // Agregar tarea al arreglo para mantener el estado
    const tarea = {
      texto: textoTarea,
      elemento: contenedorTarea,
      completada: false,
    };
    tareas.push(tarea);

    // Insertar la tarea en el formulario (si el filtro está en 'Todas' o 'Incompletas')
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

    // Limpiar el input
    inputTarea.value = "";
  }

  botonAñadir.addEventListener("click", agregarTarea);

  inputTarea.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      agregarTarea();
    }
  });

  // Función para eliminar las tareas completadas
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

  // Función para aplicar filtro
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

    // Mover la barra
    const activeTab = document.querySelector(".tab.active");
    const index = Array.from(tabs).indexOf(activeTab);
    const tabWidth = activeTab.offsetWidth;
    const offset = tabWidth * index;

    document
      .querySelector(".tabs")
      .style.setProperty("--tab-offset", `${offset}px`);

    // Aplicar filtro a las tareas
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
    // Mostrar en consola para verificar que se está llamando correctamente
    console.log("Eliminando tareas completadas");

    // Seleccionamos todos los contenedores de tareas
    const contenedoresTareas = document.querySelectorAll(".contenedor-tarea");

    // Recorremos cada contenedor de tarea
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

  // Inicializar en "Todas"
  aplicarFiltro("todas");
});

// Agregar estilo CSS para tachar las tareas completadas
document.head.insertAdjacentHTML(
  "beforeend",
  "<style>.completada { text-decoration: line-through; color: gray; }</style>"
);
