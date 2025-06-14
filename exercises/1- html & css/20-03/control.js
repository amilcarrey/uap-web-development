document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".buscador input");
    const addButton = document.querySelector(".boton-add");
    const toDoList = document.querySelector(".to-do");
    const clearCompletedButton = document.querySelector(".clear-completed");
    const allFilter = document.getElementById("tareas");
    const completedFilter = document.getElementById("completas");
    const activeFilter = document.getElementById("incompletas");
    
    function addTask() {
        const taskText = input.value.trim();
        if (taskText === "") return;

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("tarea");
        taskDiv.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${taskText}</span>
            <span class="basura">🗑</span>
        `;
        
        toDoList.insertBefore(taskDiv, clearCompletedButton);
        input.value = "";
    }

    addButton.addEventListener("click", addTask);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    toDoList.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            const taskText = e.target.nextElementSibling;
            taskText.classList.toggle("completed");
            if (e.target.checked) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "gray";
            } else {
                taskText.style.textDecoration = "none";
                taskText.style.color = "black";
            }
        }
    });

    toDoList.addEventListener("click", (e) => {
        if (e.target.classList.contains("basura")) {
            e.target.parentElement.remove();
        }
    });

    clearCompletedButton.addEventListener("click", () => {
        document.querySelectorAll(".tarea").forEach(task => {
            const checkbox = task.querySelector("input[type='checkbox']");
            if (checkbox && checkbox.checked) {
                task.remove();
            }
        });
    });

    allFilter.addEventListener("click", () => {
        document.querySelectorAll(".tarea").forEach(task => task.style.display = "flex");
    });
    
    activeFilter.addEventListener("click", () => {
        document.querySelectorAll(".tarea").forEach(task => {
            task.style.display = task.querySelector("input[type='checkbox']").checked ? "none" : "flex";
        });
    });
    
    completedFilter.addEventListener("click", () => {
        document.querySelectorAll(".tarea").forEach(task => {
            task.style.display = task.querySelector("input[type='checkbox']").checked ? "flex" : "none";
        });
    });

    document.querySelectorAll(".tarea input[type='checkbox']").forEach(checkbox => {
        if (checkbox.checked) {
            const taskText = checkbox.nextElementSibling;
            taskText.style.textDecoration = "line-through";
            taskText.style.color = "gray";
        }
    });
});
