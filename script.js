const nuevaTareaInput = document.getElementById("nueva-tarea");
const botonAgregar = document.getElementById("boton-agregar");
const tarea = document.getElementById("agregar");
const botonClear = document.getElementById("boton-clear");
const botonTodas = document.getElementById("todas");
const botonIncompletas = document.getElementById("incompletas");
const botonCompletas = document.getElementById("completas");

//funcion para agregar una nueva tarea
function agregarTarea() {
  if (nuevaTareaInput.value !== "") {
    //crea un contenedor para la tarea
    let tareaDiv = document.createElement("div");
    tareaDiv.classList.add("tarea-item");

    //crea el checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    //evento para marcar como completada
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        tareaDiv.classList.add("completada");
      } else {
        tareaDiv.classList.remove("completada");
      }
    });

    //crea el texto de la tarea
    let tareaTexto = document.createElement("span");
    tareaTexto.textContent = nuevaTareaInput.value;

    //crea el boton borrar
    let botonBorrar = document.createElement("button");
    botonBorrar.textContent = "🗑️";
    botonBorrar.classList.add("boton-borrar");

    //función del boton borrar
    botonBorrar.addEventListener("click", function () {
      tareaDiv.remove();
    });

    //agrega el checkbox, texto y boton al contenedor
    tareaDiv.appendChild(checkbox);
    tareaDiv.appendChild(tareaTexto);
    tareaDiv.appendChild(botonBorrar);

    //agrega el contenedor
    tarea.appendChild(tareaDiv);

    //borra lo escrito en el input
    nuevaTareaInput.value = "";
  } else {
    alert("Por favor, ingresa una tarea.");
  }
}

//funcion para filtrar tareas
function filtrarTareas(filtro) {
    const tareas = document.querySelectorAll(".tarea-item");
    tareas.forEach((tarea) => {
        switch (filtro) {
            case "todas":
                tarea.style.display = "flex";
                break;
            case "incompletas":
                if (tarea.classList.contains("completada")) {
                    tarea.style.display = "none";
                } else {
                    tarea.style.display = "flex";
                }
                break;
            case "completas":
                if (tarea.classList.contains("completada")) {
                    tarea.style.display = "flex";
                } else {
                    tarea.style.display = "none";
                }
                break;
        }
    });
}

//eventos para los botones de filtro
botonTodas.addEventListener("click", () => filtrarTareas("todas"));
botonIncompletas.addEventListener("click", () => filtrarTareas("incompletas"));
botonCompletas.addEventListener("click", () => filtrarTareas("completas"));


//eventos para agregar tareas con enter y click
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && document.activeElement === nuevaTareaInput) {
    agregarTarea();
  }
});

botonAgregar.addEventListener("click", agregarTarea);

// Evento para borrar todas las tareas
botonClear.addEventListener("click", function () {
  tarea.innerHTML = "";
});
