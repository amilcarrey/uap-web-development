document.addEventListener("DOMContentLoaded", function() {

    const formu = document.getElementById("formulario-principal");
    const input = document.getElementById("Quenecesitas");
    const lista = document.querySelector(".lista-tarea ul");
    const botonEliminarCompletadas = document.querySelector(".boton-completado");

    const botonVerTodas = document.getElementById("mostrar-todas");
    const botonVerIncompletas = document.getElementById("mostrar-incompletas");
    const botonVerCompletadas = document.getElementById("mostrar-completadas");

    // Enter)
    formu.addEventListener("submit", function(evento) {
        evento.preventDefault(); 

        const tareaTexto = input.value.trim();

        if (tareaTexto !== "") { // Solo si hay texto en el input
            const nuevaTarea = document.createElement("li");
            nuevaTarea.classList.add("tarea-item");

            // Crear el checkbox para marcar la tarea como completada
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox-tarea");

            // Crear la etiqueta de texto para la tarea
            const etiqueta = document.createElement("label");
            etiqueta.textContent = tareaTexto;

            // botón para eliminar la tarea
            const eliminarTarea = document.createElement("button");
            eliminarTarea.textContent = "🗑️";
            eliminarTarea.addEventListener("click", function() {
                nuevaTarea.remove(); 
            });

            // Crear el mensaje de tarea completada!.
            const mensajeCompletado = document.createElement("span");
            mensajeCompletado.classList.add("mensaje-completado");
            mensajeCompletado.textContent = "¡Tarea completada!";
            mensajeCompletado.style.display = "none"; // Inicialmente oculto

            // Mostrar el mensaje al marcar el checkbox
            checkbox.addEventListener("change", function() {
                if (checkbox.checked) {
                    mensajeCompletado.style.display = "inline"; // Mostrar mensaje
                } else {
                    mensajeCompletado.style.display = "none"; // Ocultar mensaje
                }
            });
            nuevaTarea.appendChild(checkbox);
            nuevaTarea.appendChild(etiqueta);
            nuevaTarea.appendChild(eliminarTarea);
            nuevaTarea.appendChild(mensajeCompletado);
            lista.appendChild(nuevaTarea);
            input.value = "";
        }
    });

    // Eliminar todas las tareas completadas
    botonEliminarCompletadas.addEventListener("click", function() {
        const tareas = document.querySelectorAll(".tarea-item");
        tareas.forEach(function(tarea) {
            const checkbox = tarea.querySelector(".checkbox-tarea");
            if (checkbox.checked) {
                tarea.remove(); // Eliminar tarea si está marcada
            }
        });
    });

    // Mostrar todas las tareas
    botonVerTodas.addEventListener("click", function() {
        const tareas = document.querySelectorAll(".tarea-item");
        tareas.forEach(function(tarea) {
            tarea.style.display = "flex"; // Mostrar todas las tareas
        });
    });

    // Mostrar tareas incompletas
    botonVerIncompletas.addEventListener("click", function() {
        const tareas = document.querySelectorAll(".tarea-item");
        tareas.forEach(function(tarea) {
            const checkbox = tarea.querySelector(".checkbox-tarea");
            if (checkbox.checked) {
                tarea.style.display = "none"; // Ocultar tareas completadas
            } else {
                tarea.style.display = "flex"; // Mostrar solo las incompletas
            }
        });
    });

    // Mostrar tareas completadas
    botonVerCompletadas.addEventListener("click", function() {
        const tareas = document.querySelectorAll(".tarea-item");
        tareas.forEach(function(tarea) {
            const checkbox = tarea.querySelector(".checkbox-tarea");
            if (checkbox.checked) {
                tarea.style.display = "flex"; // Mostrar tareas completadas
            } else {
                tarea.style.display = "none"; // Ocultar tareas incompletas
            }
        });
    });
});
