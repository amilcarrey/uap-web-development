// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene referencias a los elementos del DOM
    const taskInput = document.getElementById("taskInput"); // Campo de entrada de texto
    const addTaskBtn = document.getElementById("addTaskBtn"); // Botón para agregar tarea
    const taskList = document.getElementById("taskList"); // Lista de tareas
    const clearCompletedBtn = document.getElementById("clearCompleted"); // Botón para limpiar tareas completadas
    const filters = document.querySelectorAll(".filter"); // Botones de filtro (Todas, Incompletas, Completadas)

    // Función para agregar una nueva tarea
    function addTask() {
        const text = taskInput.value.trim(); // Obtiene el texto de l   a entrada y elimina espacios extra
        if (text === "") return; // Si el campo está vacío, no hace nada

        // Crea un nuevo elemento de lista (tarea)
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item"); // Agrega la clase CSS para estilos

        // Define el contenido de la tarea con un checkbox, el texto y un icono de basura
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox"> <!-- Checkbox para marcar como completada -->
            <span class="task-name">${text}</span> <!-- Nombre de la tarea -->
            <span class="icon icon-trash">🗑️</span> <!-- Icono de eliminar tarea -->
        `;

        // Agrega la tarea a la lista
        taskList.appendChild(taskItem);

        // Limpia el campo de entrada después de agregar la tarea
        taskInput.value = "";
    }

    // Agrega la tarea cuando se hace clic en el botón "Agregar"
    addTaskBtn.addEventListener("click", addTask);

    // Permite agregar tareas presionando "Enter" en el campo de entrada
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Maneja los eventos de clic dentro de la lista de tareas
    taskList.addEventListener("click", (event) => {
        // Si se hace clic en un checkbox, alterna la clase "completed"
        if (event.target.classList.contains("task-checkbox")) {
            event.target.parentElement.classList.toggle("completed");
        }

        // Si se hace clic en el icono de basura, elimina la tarea
        if (event.target.classList.contains("icon-trash")) {
            event.target.parentElement.remove();
        }
    });

    // Elimina todas las tareas que estén marcadas como completadas
    clearCompletedBtn.addEventListener("click", () => {
        document.querySelectorAll(".task-item.completed").forEach(task => task.remove());
    });

    // Maneja el filtrado de tareas según el botón seleccionado
    filters.forEach(button => {
        button.addEventListener("click", () => {
            // Quita la clase "active" de todos los botones y la agrega solo al seleccionado
            filters.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Obtiene el filtro seleccionado (Todas, Incompletas o Completadas)
            const filter = button.getAttribute("data-filter");

            // Filtra las tareas según el criterio seleccionado
            document.querySelectorAll(".task-item").forEach(task => {
                switch (filter) {
                    case "all": // Muestra todas las tareas
                        task.style.display = "flex";
                        break;
                    case "incomplete": // Muestra solo las tareas incompletas
                        task.style.display = task.classList.contains("completed") ? "none" : "flex";
                        break;
                    case "completed": // Muestra solo las tareas completadas
                        task.style.display = task.classList.contains("completed") ? "flex" : "none";
                        break;
                }
            });
        });
    });
});
