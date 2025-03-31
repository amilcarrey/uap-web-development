document.addEventListener("DOMContentLoaded", () => {
    const formTarea = document.getElementById("form-tarea");
    const inputTarea = document.getElementById("input-tarea");
    const listaTareas = document.getElementById("lista-tareas");
    const btnEliminarCompletadas = document.getElementById("eliminar-completadas");
    const btnMostrarCompletadas = document.getElementById("mostrar-completadas");
    const btnMostrarIncompletas = document.getElementById("mostrar-incompletas");

    let filtroActivo = ""; // Variable para rastrear el filtro activo (completadas o incompletas)

    const agregarTarea = () => {
        const textoTarea = inputTarea.value.trim();
        if (textoTarea === "") {
            alert("Por favor, ingresa una tarea.");
            return;
        }

        const nuevaTarea = document.createElement("li");
        nuevaTarea.classList.add("tarea-item");
        nuevaTarea.innerHTML = `
            <input type="checkbox" class="tarea-checkbox">
            <span class="tarea-texto">${textoTarea}</span>
            <button class="btn-eliminar">Eliminar</button>
        `;

        listaTareas.appendChild(nuevaTarea);
        inputTarea.value = "";
    };

    formTarea.addEventListener("submit", (event) => {
        event.preventDefault();
        agregarTarea();
    });

    listaTareas.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("btn-eliminar")) {
            target.closest("li").remove();
        }
    });

    btnEliminarCompletadas.addEventListener("click", () => {
        const tareasCompletadas = listaTareas.querySelectorAll(".tarea-checkbox:checked");
        tareasCompletadas.forEach(tarea => {
            tarea.closest("li").remove();
        });
    });

    // Mostrar solo tareas completadas
    btnMostrarCompletadas.addEventListener("click", () => {
        if (filtroActivo === "completadas") {
            restaurarListaCompleta();
        } else {
            aplicarFiltro(true); // Mostrar solo completadas
            filtroActivo = "completadas";
        }
    });

    // Mostrar solo tareas incompletas
    btnMostrarIncompletas.addEventListener("click", () => {
        if (filtroActivo === "incompletas") {
            restaurarListaCompleta();
        } else {
            aplicarFiltro(false); // Mostrar solo incompletas
            filtroActivo = "incompletas";
        }
    });

    // Función para aplicar el filtro
    const aplicarFiltro = (completadas) => {
        const tareas = listaTareas.querySelectorAll(".tarea-item");
        tareas.forEach(tarea => {
            const checkbox = tarea.querySelector(".tarea-checkbox");
            tarea.style.display = checkbox.checked === completadas ? "block" : "none";
        });
    };

    // Función para restaurar la lista completa
    const restaurarListaCompleta = () => {
        const tareas = listaTareas.querySelectorAll(".tarea-item");
        tareas.forEach(tarea => {
            tarea.style.display = "block"; // Mostrar todas las tareas
        });
        filtroActivo = ""; // Reiniciar el filtro activo
    };
});