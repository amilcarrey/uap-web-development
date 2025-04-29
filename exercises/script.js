const input = document.getElementById("tareaInput");
const boton = document.getElementById("agregarBtn");
const lista = document.querySelector(".lista-tareas");

// Agregar tarea nueva
boton.addEventListener("click", function () {
  const tareaTexto = input.value.trim();
  if (tareaTexto === "") return;

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completada", checkbox.checked);
  });

  const span = document.createElement("span");
  span.classList.add("tarea");
  span.textContent = tareaTexto;

  const eliminarBtn = document.createElement("button");
  eliminarBtn.textContent = "Eliminar";
  eliminarBtn.classList.add("eliminar");
  eliminarBtn.addEventListener("click", () => li.remove());

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(eliminarBtn);
  lista.appendChild(li);

  input.value = "";
});
// Filtrar tareas según el estado
function filtrar(filtro) {
  const tareas = document.querySelectorAll(".lista-tareas li");
  tareas.forEach(tarea => {
    const completada = tarea.classList.contains("completada");
    if (filtro === "todas") {
      tarea.style.display = "";
    } else if (filtro === "hechas") {
      tarea.style.display = completada ? "" : "none";
    } else if (filtro === "pendientes") {
      tarea.style.display = !completada ? "" : "none";
    }
  });
}
