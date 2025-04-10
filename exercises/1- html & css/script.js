document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".task-input input");
    const addButton = document.querySelector(".task-input button");
    const toDoList = document.querySelector(".task-list");
    const clearCompletedButton = document.querySelector(".clear-completed");
    
    const allTab = document.getElementById("all-tasks");
    const completedTab = document.getElementById("completed-tasks");
    const incompleteTab = document.getElementById("incomplete-tasks");

    // Función para agregar una tarea
    function addTask() {
        const taskText = input.value.trim();
        if (taskText === "") return; // Evita agregar tareas vacías

        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <label>
                <input type="checkbox">
                <span>${taskText}</span>
            </label>
            <button class="borrar-tarea">🗑️</button>
        `;

        toDoList.appendChild(taskItem); // Agrega la tarea a la lista
        input.value = ""; // Limpia el input después de agregar
        input.focus(); // Mantiene el cursor en el input
    }

    // Agregar tarea con botón o Enter
    addButton.addEventListener("click", addTask);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    // Eliminar una tarea al hacer clic en la papelera
    toDoList.addEventListener("click", (e) => {
        if (e.target.classList.contains("borrar-tarea")) {
            e.target.closest("li").remove();
        }
    });

    // Función para marcar tareas como completadas o incompletas
    function toggleTaskCompletion(e) {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            const taskText = e.target.nextElementSibling;
            if (e.target.checked) {
                taskText.style.textDecoration = "line-through";
            } else {
                taskText.style.textDecoration = "none";
            }
        }
    }

    // Evento para detectar cambios en los checkboxes
    toDoList.addEventListener("change", toggleTaskCompletion);

    // Filtrar tareas
    function filterTasks(filter) {
        const tasks = toDoList.querySelectorAll("li");
        tasks.forEach((task) => {
            const checkbox = task.querySelector("input[type='checkbox']");
            const isChecked = checkbox.checked;

            if (filter === "all") {
                task.style.display = "block";
            } else if (filter === "completed" && isChecked) {
                task.style.display = "block";
            } else if (filter === "incomplete" && !isChecked) {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        });
    }

    // Función para mover la vista a las tareas completadas
    function scrollToCompletedTasks() {
        const completedTasks = toDoList.querySelectorAll("li");
        const completedTask = Array.from(completedTasks).find((task) => {
            const checkbox = task.querySelector("input[type='checkbox']");
            return checkbox.checked;
        });

        if (completedTask) {
            completedTask.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Evento para cambiar el filtro
    allTab.addEventListener("click", () => {
        filterTasks("all");
        setActiveTab(allTab);
    });

    completedTab.addEventListener("click", () => {
        filterTasks("completed");
        setActiveTab(completedTab);
        scrollToCompletedTasks(); // Desplazarse hacia las tareas completadas
    });

    incompleteTab.addEventListener("click", () => {
        filterTasks("incomplete");
        setActiveTab(incompleteTab);
    });

    // Cambiar la clase "active" para los botones de filtro
    function setActiveTab(activeTab) {
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach(tab => tab.classList.remove("active"));
        activeTab.classList.add("active");
    
   if (activeTab === incompleteTab) {
        clearCompletedButton.style.display = "none";
    } else {
        clearCompletedButton.style.display = "block";
    }

    }

    // Inicializar con todas las tareas visibles
    filterTasks("all");

    // Botón de eliminar tareas completadas
    clearCompletedButton.addEventListener("click", () => {
        const completedTasks = toDoList.querySelectorAll("input[type='checkbox']:checked");
        completedTasks.forEach((checkbox) => {
            checkbox.closest("li").remove();
        });
    });
});
