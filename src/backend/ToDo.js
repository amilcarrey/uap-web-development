document.addEventListener("DOMContentLoaded", function () {
    const agregar = document.getElementById("Agregar"); // Botón de agregar
    const inputTarea = document.getElementById("task"); // Input de la tarea
    const listaTareas = document.querySelector(".task-list"); // Contenedor de tareas
    const clear = document.getElementById("clear"); // Botón de limpiar
    const terminadas = document.getElementById("Terminadas"); // Botón de tareas terminadas
    const pendientes = document.getElementById("Pendientes"); // Botón de tareas pendientes

    function agregarEventos(tareaDiv) 
    {
        const check = tareaDiv.querySelector(".checkmark");
        const span = tareaDiv.querySelector(".task-text");
        const botonEliminar = tareaDiv.querySelector(".deletemark");

        if (check.checked) 
        {
            tareaDiv.classList.add("finalizada");
            span.classList.add("completed");
        }

        // Evento para tachar y actualizar la clase finalizada
        check.addEventListener("change", function () 
        {
            span.classList.toggle("completed"); // Agrega o quita tachado
            tareaDiv.classList.toggle("finalizada"); // Agrega o quita la case finalizada al div de las tareas (task) entonces gracias a esto filtro
        });

        // Evento para eliminar
        botonEliminar.addEventListener("click", function () 
        {
            tareaDiv.remove();
        });
    }

    //Hago que las tareas ya creadas tengan los eventos tambien
    document.querySelectorAll(".task").forEach(agregarEventos);

    function agregarTarea() 
    {
        const nuevaTarea = inputTarea.value.trim();
        if (nuevaTarea === "") 
        {
            alert("Porfavor escriba la tarea a agregar");
            return;
        }

        const tareaDiv = document.createElement("div");
        tareaDiv.classList.add("task");

        const check = document.createElement("input");
        check.type = "checkbox";
        check.classList.add("checkmark");

        const span = document.createElement("span");
        span.classList.add("task-text");
        span.textContent = nuevaTarea;

        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("deletemark");
        botonEliminar.textContent = "🗑️";

        tareaDiv.appendChild(check);
        tareaDiv.appendChild(span);
        tareaDiv.appendChild(botonEliminar);

        listaTareas.appendChild(tareaDiv);

        // Agregar eventos a la nueva tarea
        agregarEventos(tareaDiv);

        inputTarea.value = "";
    }

    agregar.addEventListener("click", agregarTarea);

    clear.addEventListener("click", function () 
    {
        listaTareas.innerHTML = ""; // Vacía todas las tareas de una vez
    });

    terminadas.addEventListener("click", function () 
    {
        document.querySelectorAll(".task").forEach(tarea => 
        {
            if (tarea.classList.contains("finalizada")) 
            {
                tarea.style.display = "flex"; // Mostrar tareas completadas
            } else {
                tarea.style.display = "none"; // Ocultar tareas pendientes
            }
        });
    });

    pendientes.addEventListener("click", function () 
    {
        document.querySelectorAll(".task").forEach(tarea => 
        {
            if (tarea.classList.contains("finalizada")) 
            {
                tarea.style.display = "none"; 
            } else { 
            tarea.style.display = "flex"; 
        
            }
        });
    });
});
