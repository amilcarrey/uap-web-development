//elementos del DOM
const inputTarea = document.getElementsByClassName("escribir-tarea");
const ulTareas = document.getElementsByClassName("lista-tareas");
const checkbox = document.getElementsByClassName("checkbox");
const eliminar = document.getElementsByClassName("eliminar");
const eliminarCompletas = document.getElementById("eliminarCompletas");
const btnIncompletas = document.getElementById("verIncompletas");
const btnCompletas = document.getElementById("verCompletas");
const btnTodas = document.getElementById("verTodas");

// Se crea una nueva tarea y se agrega a la lista de tareas
function agregarTarea() {
  const nombreTarea = inputTarea[0].value;
  const nuevaTarea = document.createElement("li");
  nuevaTarea.className = "tarea";

  if (nombreTarea === "") {
    alert("No se puede agregar una tarea vacía");
  } else {
    nuevaTarea.innerHTML = `
      <input type="checkbox" class="checkbox" />
      <span>${nombreTarea}</span>
      <button class="eliminar">Eliminar</button>
    `;
    ulTareas[0].appendChild(nuevaTarea);
    inputTarea[0].value = "";
  }
}

// Marcar tarea como completada
// Se agrega la clase completada a la tarea si el checkbox está marcado
function validarTarea() {
  const tareas = document.getElementsByClassName("tarea");
  for (let i = 0; i < tareas.length; i++) {
    if (checkbox[i].checked) {
      tareas[i].classList.add("completada");
    } else {
      tareas[i].classList.remove("completada");
    }
  }
}

// Borrar completas
function borrarCompletas() {
  const tareas = document.getElementsByClassName("tarea");
  const tareasCompletas = document.getElementsByClassName("tarea completada");
  for (let i = tareasCompletas.length - 1; i >= 0; i--) {
    const tarea = tareasCompletas[i];
    ulTareas[0].removeChild(tarea);
  }
}

//Filtros
function mostrarTodas() {
  document.querySelectorAll(".tarea").forEach((tarea) => {
    tarea.style.visibility = "visible";
    tarea.style.position = "relative";
  });
}

function mostrarIncompletas() {
  document.querySelectorAll(".tarea").forEach((tarea) => {
    if (tarea.classList.contains("completada")) {
      tarea.style.visibility = "hidden";
      tarea.style.position = "absolute";
    } else {
      tarea.style.visibility = "visible";
      tarea.style.position = "relative";
    }
  });
}

function mostrarCompletas() {
  document.querySelectorAll(".tarea").forEach((tarea) => {
    if (tarea.classList.contains("completada")) {
      tarea.style.visibility = "visible";
      tarea.style.position = "relative";
    } else {
      tarea.style.visibility = "hidden";
      tarea.style.position = "absolute";
    }
  });
}

//Eventos

// Agregar con enter
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("Se presionó Enter");
    agregarTarea();
  }
});

// eliminar tarea
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("eliminar")) {
    const tarea = event.target.parentElement;
    ulTareas[0].removeChild(tarea);
  }
});

//validar tarea
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("checkbox")) {
    validarTarea();
  }
});
