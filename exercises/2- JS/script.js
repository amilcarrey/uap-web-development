// Esta todo comentado porque me sirve para estudiar
document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del DOM
    const input = document.querySelector(".input-section input"); // El campo de texto donde se escribe la tarea
    const addButton = document.querySelector(".add-btn"); // El botón de agregar tarea
    const taskList = document.querySelector(".task-list"); // El contenedor donde se mostrarán las tareas
    const clearCompleted = document.querySelector(".clear-completed"); // El botón para limpiar las tareas completadas
    const tabs = document.querySelectorAll(".tab"); // Todas las pestañas (si hay más de una categoría de tareas)
    const filterButtons = document.querySelectorAll(".filter-btn"); // Los botones de filtro (todos, incompletos, completados)

    // Función que agrega una nueva tarea
    function addTask() {
        // Obtiene el valor del campo de texto y lo limpia de espacios extra
        const text = input.value.trim();
        // Si el campo está vacío, no hace nada
        if (text === "") return;

        // Crea el elemento div que representará la tarea
        const task = document.createElement("div");
        task.classList.add("task"); // Agrega la clase 'task' para estilizarla
        task.innerHTML = `
            <button class="check-btn">✓</button> <!-- Botón para marcar la tarea como completada -->
            <span class="task-text">${text}</span> <!-- El texto de la tarea -->
            <button class="delete-btn">🗑️</button> <!-- Botón para eliminar la tarea -->
        `;
        // Agrega la tarea al contenedor de tareas
        taskList.appendChild(task);
        // Limpia el campo de texto después de agregar la tarea
        input.value = "";
        // Actualiza los event listeners de los botones dentro de la nueva tarea
        updateEventListeners();
    }

    // Función que actualiza los event listeners de los botones de cada tarea
    function updateEventListeners() {
        // Agrega el event listener al botón de marcar tarea como completada
        document.querySelectorAll(".check-btn").forEach(btn => {
            btn.onclick = () => {
                // Cuando se hace clic en el botón, alterna la clase 'completed' en el texto de la tarea
                const textElement = btn.nextElementSibling; // El siguiente elemento es el span con el texto
                textElement.classList.toggle("completed");
                // Aplica el filtro actual después de marcar o desmarcar la tarea
                applyFilter();
            };
        });

        // Agrega el event listener al botón de eliminar tarea
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.onclick = () => {
                // Elimina la tarea del DOM
                btn.parentElement.remove();
            };
        });
    }

    // Función que maneja el evento de agregar tarea (clic o tecla Enter)
    function handleAddEvent(event) {
        if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
            // Si se hace clic o se presiona Enter, agrega una tarea
            addTask();
        }
    }

    // Función que aplica el filtro seleccionado a las tareas
    function applyFilter() {
        // Obtiene el filtro activo, por defecto es 'all' (todas las tareas)
        const filter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
        // Recorre todas las tareas y las muestra u oculta según el filtro
        document.querySelectorAll(".task").forEach(task => {
            const textElement = task.querySelector(".task-text"); // El texto de la tarea
            const isCompleted = textElement.classList.contains("completed"); // Verifica si la tarea está completada

            // Aplica el estilo de tachado si la tarea está completada
            if (isCompleted) {
                textElement.style.textDecoration = "line-through";
            } else {
                textElement.style.textDecoration = "none";
            }

            // Muestra u oculta la tarea según el filtro
            if (filter === "all" || (filter === "completed" && isCompleted) || (filter === "incomplete" && !isCompleted)) {
                task.style.display = "flex"; // Muestra la tarea
            } else {
                task.style.display = "none"; // Oculta la tarea
            }
        });
    }

    // Evento para agregar tarea al hacer clic en el botón de agregar
    addButton.addEventListener("click", handleAddEvent);
    // Evento para agregar tarea al presionar la tecla Enter
    input.addEventListener("keypress", handleAddEvent);

    // Evento para eliminar todas las tareas completadas cuando se hace clic en el botón "Clear Completed"
    clearCompleted.addEventListener("click", () => {
        // Elimina todas las tareas marcadas como completadas
        document.querySelectorAll(".task-text.completed").forEach(task => {
            task.parentElement.remove();
        });
    });

    // Eventos para las pestañas, cambiando la clase 'active' para cambiar de categoría
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Elimina la clase 'active' de la pestaña actual
            document.querySelector(".tab.active").classList.remove("active");
            // Agrega la clase 'active' a la pestaña seleccionada
            tab.classList.add("active");
        });
    });

    // Eventos para los botones de filtro, cambiando el filtro activo y aplicando el filtro
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Elimina la clase 'active' del filtro anterior
            document.querySelector(".filter-btn.active")?.classList.remove("active");
            // Agrega la clase 'active' al botón de filtro seleccionado
            btn.classList.add("active");
            // Aplica el filtro seleccionado
            applyFilter();
        });
    });

    // Inicializa los event listeners para las tareas existentes (si hay alguna)
    updateEventListeners();
});
