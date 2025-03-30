document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".agregar input");
    const addButton = document.querySelector(".agregar button");
    const tasksContainer = document.querySelector(".tareas");

    const addTask = () => {
        const taskText = input.value.trim();
        if (taskText === "") {
            alert("Por favor, ingresa una tarea.");
            return;
        }

        const taskElement = document.createElement("div");
        taskElement.classList.add("tarea");
        taskElement.innerHTML = `
            <input type="checkbox">
            <p>${taskText}</p>
            <button>Eliminar</button>
        `;

        taskElement.querySelector("button").addEventListener("click", () => {
            taskElement.remove();
        });

        taskElement.querySelector("input[type='checkbox']").addEventListener("change", (e) => {
            taskElement.classList.toggle("completa", e.target.checked);
        });

        tasksContainer.appendChild(taskElement);
        input.value = "";
    };

    const handleAddTaskEvent = (e) => {
        if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
            addTask();
        }
    };

    addButton.addEventListener("click", handleAddTaskEvent);
    input.addEventListener("keydown", handleAddTaskEvent);

    const clearCompletedButton = document.createElement("button");
    clearCompletedButton.textContent = "Eliminar Completadas";
    clearCompletedButton.addEventListener("click", () => {
        document.querySelectorAll(".tarea.completa").forEach((task) => task.remove());
    });
    tasksContainer.parentElement.appendChild(clearCompletedButton);

    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filtros");
    ["Todas", "Incompletas", "Completas"].forEach((filter) => {
        const filterButton = document.createElement("button");
        filterButton.textContent = filter;
        filterButton.addEventListener("click", () => {
            const tasks = document.querySelectorAll(".tarea");
            tasks.forEach((task) => {
                task.style.display = "flex";
                if (filter === "Incompletas" && task.classList.contains("completa")) {
                    task.style.display = "none";
                } else if (filter === "Completas" && !task.classList.contains("completa")) {
                    task.style.display = "none";
                }
            });
        });
        filterContainer.appendChild(filterButton);
    });
    tasksContainer.parentElement.appendChild(filterContainer);
});